import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Lightbulb, AlertTriangle, RefreshCw } from "lucide-react";
import { useAppData } from "@/contexts/AppContext";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  forecastSales,
  kMeansClustering,
  detectAnomalies,
  generateRecommendations,
  type DataPoint,
} from "@/lib/mlAlgorithms";
import { useToast } from "@/hooks/use-toast";

export default function AIIntelligence() {
  const { data } = useAppData();
  const { toast } = useToast();
  const [forecastPeriods, setForecastPeriods] = useState(6);

  // Prepare historical sales data
  const historicalSales: DataPoint[] = useMemo(() => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = startOfMonth(subMonths(new Date(), 11 - i));
      const monthKey = format(date, "MMM yyyy");
      const monthSales = data.sales
        .filter(sale => format(new Date(sale.date), "MMM yyyy") === monthKey)
        .reduce((sum, sale) => sum + sale.total, 0);
      
      return { date: date.toISOString(), value: monthSales };
    });
    return last12Months;
  }, [data.sales]);

  // Generate sales forecast
  const salesForecast = useMemo(() => {
    return forecastSales(historicalSales, forecastPeriods);
  }, [historicalSales, forecastPeriods]);

  // Prepare forecast chart data
  const forecastChartData = useMemo(() => {
    const historical = historicalSales.map(d => ({
      month: format(new Date(d.date), "MMM yy"),
      actual: d.value,
      predicted: null,
      lower: null,
      upper: null,
    }));
    
    const forecast = salesForecast.map(f => ({
      month: format(new Date(f.date), "MMM yy"),
      actual: null,
      predicted: f.predicted,
      lower: f.confidence.lower,
      upper: f.confidence.upper,
    }));
    
    return [...historical, ...forecast];
  }, [historicalSales, salesForecast]);

  // Customer Segmentation using RFM (Recency, Frequency, Monetary)
  const customerSegments = useMemo(() => {
    const customerData = data.customers.map(customer => {
      const customerSales = data.sales.filter(s => s.customerId === customer.id);
      
      // Recency: days since last purchase
      const lastPurchase = customerSales.length > 0
        ? Math.max(...customerSales.map(s => new Date(s.date).getTime()))
        : 0;
      const recency = lastPurchase > 0
        ? (Date.now() - lastPurchase) / (1000 * 60 * 60 * 24)
        : 999;
      
      // Frequency: number of purchases
      const frequency = customerSales.length;
      
      // Monetary: total spending
      const monetary = customerSales.reduce((sum, s) => sum + s.total, 0);
      
      return {
        id: customer.id,
        name: customer.name,
        features: [
          1 / (recency + 1), // Normalize recency (higher is better)
          frequency,
          monetary / 10000, // Normalize monetary
        ],
        rawMetrics: { recency, frequency, monetary },
      };
    });

    // Perform clustering
    const clusters = kMeansClustering(customerData, 4);
    
    // Label clusters based on characteristics
    return clusters.map((cluster, idx) => {
      const clusterCustomers = customerData.filter(c => cluster.items.includes(c.id));
      const avgRecency = clusterCustomers.reduce((sum, c) => sum + c.rawMetrics.recency, 0) / clusterCustomers.length;
      const avgFrequency = clusterCustomers.reduce((sum, c) => sum + c.rawMetrics.frequency, 0) / clusterCustomers.length;
      const avgMonetary = clusterCustomers.reduce((sum, c) => sum + c.rawMetrics.monetary, 0) / clusterCustomers.length;
      
      let label = "Regular Customers";
      if (avgRecency < 30 && avgMonetary > 50000) label = "VIP Champions";
      else if (avgRecency > 90) label = "At Risk";
      else if (avgFrequency < 3) label = "New Customers";
      
      return {
        id: idx,
        label,
        customers: clusterCustomers,
        metrics: { avgRecency, avgFrequency, avgMonetary },
        count: clusterCustomers.length,
      };
    }).sort((a, b) => b.metrics.avgMonetary - a.metrics.avgMonetary);
  }, [data.customers, data.sales]);

  // Product recommendations based on purchase patterns
  const productRecommendations = useMemo(() => {
    // Build user-item matrix (customer-product purchases)
    const matrix = new Map<string, Map<string, number>>();
    
    data.sales.forEach(sale => {
      if (!matrix.has(sale.customerId)) {
        matrix.set(sale.customerId, new Map());
      }
      const customerItems = matrix.get(sale.customerId)!;
      
      sale.items.forEach(item => {
        const current = customerItems.get(item.itemId) || 0;
        customerItems.set(item.itemId, current + item.quantity);
      });
    });
    
    // Get recommendations for each customer segment
    return customerSegments.slice(0, 3).map(segment => {
      if (segment.customers.length === 0) return { segment: segment.label, recommendations: [] };
      
      // Use first customer as representative
      const sampleCustomerId = segment.customers[0].id;
      const recs = generateRecommendations(sampleCustomerId, matrix, 5);
      
      return {
        segment: segment.label,
        recommendations: recs.map(r => {
          const item = data.stock.find(s => s.id === r.itemId);
          return {
            name: item?.name || "Unknown",
            score: r.score,
          };
        }),
      };
    });
  }, [customerSegments, data.sales, data.stock]);

  // Anomaly Detection
  const anomalies = useMemo(() => {
    return detectAnomalies(historicalSales, 2.0);
  }, [historicalSales]);

  // Demand Prediction for top products
  const demandPrediction = useMemo(() => {
    return data.stock.slice(0, 10).map(item => {
      const itemSales = data.sales.flatMap(s => 
        s.items.filter(i => i.itemId === item.id).map(i => i.quantity)
      );
      
      const avgDemand = itemSales.length > 0
        ? itemSales.reduce((a, b) => a + b, 0) / itemSales.length
        : 0;
      
      const predicted = avgDemand * 1.1; // Simple 10% growth prediction
      const stockDays = avgDemand > 0 ? item.quantity / avgDemand : 999;
      
      return {
        name: item.name,
        currentStock: item.quantity,
        avgDemand: Math.round(avgDemand),
        predicted: Math.round(predicted),
        stockDays: Math.round(stockDays),
        status: stockDays < 7 ? "urgent" : stockDays < 30 ? "low" : "good",
      };
    });
  }, [data.stock, data.sales]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Intelligence
        </h1>
        <p className="text-muted-foreground">Machine learning insights and predictions</p>
      </div>

      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
          <TabsTrigger value="demand">Demand Prediction</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Forecast
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForecastPeriods(3)}
                  >
                    3 Months
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForecastPeriods(6)}
                  >
                    6 Months
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForecastPeriods(12)}
                  >
                    12 Months
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                ML-powered revenue forecasting with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={forecastChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Actual Sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.4}
                    name="Predicted Sales"
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted))"
                    fillOpacity={0.2}
                    name="Upper Bound"
                    strokeDasharray="2 2"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {salesForecast.slice(0, 3).map((f, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      {format(new Date(f.date), "MMMM yyyy")}
                    </h4>
                    <p className="text-2xl font-bold mt-1">₹{f.predicted.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Range: ₹{f.confidence.lower.toFixed(0)} - ₹{f.confidence.upper.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Demand Prediction
              </CardTitle>
              <CardDescription>
                Predict future demand and optimize inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demandPrediction.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {item.currentStock} | Avg Demand: {item.avgDemand}/month
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Predicted Demand</p>
                        <p className="text-lg font-bold">{item.predicted}/month</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "urgent"
                            ? "destructive"
                            : item.status === "low"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {item.stockDays} days stock
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Segmentation
              </CardTitle>
              <CardDescription>
                ML-based customer clustering using RFM analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {customerSegments.map((segment) => (
                  <div key={segment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{segment.label}</h3>
                      <Badge>{segment.count} customers</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Spending:</span>
                        <span className="font-medium">₹{segment.metrics.avgMonetary.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Purchase Frequency:</span>
                        <span className="font-medium">{segment.metrics.avgFrequency.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Recency:</span>
                        <span className="font-medium">{segment.metrics.avgRecency.toFixed(0)} days</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Top Customers:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {segment.customers.slice(0, 3).map(c => (
                          <Badge key={c.id} variant="outline" className="text-xs">
                            {c.name}
                          </Badge>
                        ))}
                        {segment.customers.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{segment.customers.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Intelligent Recommendations
              </CardTitle>
              <CardDescription>
                Collaborative filtering-based product suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-3">{rec.segment}</h3>
                    {rec.recommendations.length > 0 ? (
                      <div className="space-y-2">
                        {rec.recommendations.map((product, pidx) => (
                          <div key={pidx} className="flex items-center justify-between">
                            <span className="text-sm">{product.name}</span>
                            <Badge variant="outline">
                              Score: {product.score.toFixed(2)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No recommendations available for this segment
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Anomaly Detection
              </CardTitle>
              <CardDescription>
                Statistical outlier detection in sales patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <div className="space-y-3">
                  {anomalies.map((anomaly, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {format(new Date(anomaly.date), "MMMM yyyy")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {anomaly.type === "spike" ? "Unusual spike" : "Unusual drop"} detected
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Actual</p>
                          <p className="font-bold">₹{anomaly.value.toFixed(0)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Expected</p>
                          <p className="font-medium">₹{anomaly.expected.toFixed(0)}</p>
                        </div>
                        <Badge
                          variant={
                            anomaly.severity === "high"
                              ? "destructive"
                              : anomaly.severity === "medium"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {anomaly.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No anomalies detected in the data</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All sales patterns are within normal range
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
