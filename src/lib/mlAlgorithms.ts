// Client-side ML algorithms for forecasting and analysis

export interface DataPoint {
  date: string;
  value: number;
}

export interface ForecastResult {
  date: string;
  predicted: number;
  confidence: { lower: number; upper: number };
}

export interface CustomerSegment {
  id: string;
  name: string;
  customers: string[];
  characteristics: {
    avgSpending: number;
    frequency: number;
    recency: number;
  };
}

export interface Anomaly {
  date: string;
  value: number;
  expected: number;
  severity: "low" | "medium" | "high";
  type: string;
}

// Moving Average for trend smoothing
export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  return result;
}

// Exponential Smoothing for forecasting
export function exponentialSmoothing(data: number[], alpha: number = 0.3): number[] {
  const result: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
}

// Simple Linear Regression for trend analysis
export function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// Sales Forecasting using exponential smoothing and trend
export function forecastSales(historicalData: DataPoint[], periods: number): ForecastResult[] {
  const values = historicalData.map(d => d.value);
  const smoothed = exponentialSmoothing(values, 0.3);
  
  // Calculate trend
  const x = Array.from({ length: values.length }, (_, i) => i);
  const { slope, intercept } = linearRegression(x, smoothed);
  
  // Calculate standard deviation for confidence interval
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const forecasts: ForecastResult[] = [];
  const lastValue = smoothed[smoothed.length - 1];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= periods; i++) {
    const predicted = lastValue + slope * i;
    const futureDate = new Date(lastDate);
    futureDate.setMonth(futureDate.getMonth() + i);
    
    forecasts.push({
      date: futureDate.toISOString(),
      predicted: Math.max(0, predicted),
      confidence: {
        lower: Math.max(0, predicted - 1.96 * stdDev),
        upper: predicted + 1.96 * stdDev,
      },
    });
  }
  
  return forecasts;
}

// K-means clustering for customer segmentation
export function kMeansClustering(
  data: Array<{ id: string; features: number[] }>,
  k: number,
  maxIterations: number = 100
): Array<{ clusterId: number; items: string[] }> {
  if (data.length === 0 || k <= 0) return [];
  
  // Initialize centroids randomly
  const centroids = data.slice(0, k).map(d => [...d.features]);
  
  let assignments = new Array(data.length).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;
    
    // Assign points to nearest centroid
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const dist = euclideanDistance(data[i].features, centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = j;
        }
      }
      
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Update centroids
    for (let j = 0; j < k; j++) {
      const clusterPoints = data.filter((_, i) => assignments[i] === j);
      if (clusterPoints.length > 0) {
        const featureCount = data[0].features.length;
        centroids[j] = Array.from({ length: featureCount }, (_, fi) =>
          clusterPoints.reduce((sum, p) => sum + p.features[fi], 0) / clusterPoints.length
        );
      }
    }
  }
  
  // Group by cluster
  const clusters: Array<{ clusterId: number; items: string[] }> = [];
  for (let j = 0; j < k; j++) {
    clusters.push({
      clusterId: j,
      items: data.filter((_, i) => assignments[i] === j).map(d => d.id),
    });
  }
  
  return clusters;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Anomaly Detection using Z-score method
export function detectAnomalies(data: DataPoint[], threshold: number = 2.5): Anomaly[] {
  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const anomalies: Anomaly[] = [];
  
  data.forEach(point => {
    const zScore = Math.abs((point.value - mean) / stdDev);
    if (zScore > threshold) {
      let severity: "low" | "medium" | "high" = "low";
      if (zScore > threshold * 1.5) severity = "high";
      else if (zScore > threshold * 1.2) severity = "medium";
      
      anomalies.push({
        date: point.date,
        value: point.value,
        expected: mean,
        severity,
        type: point.value > mean ? "spike" : "drop",
      });
    }
  });
  
  return anomalies;
}

// Recommendation Engine using collaborative filtering
export function generateRecommendations(
  userId: string,
  userItemMatrix: Map<string, Map<string, number>>,
  topN: number = 5
): Array<{ itemId: string; score: number }> {
  const userRatings = userItemMatrix.get(userId);
  if (!userRatings) return [];
  
  const itemScores = new Map<string, number>();
  
  // Find similar users and their preferences
  userItemMatrix.forEach((otherRatings, otherUserId) => {
    if (otherUserId === userId) return;
    
    // Calculate similarity (simple cosine similarity)
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    userRatings.forEach((rating, itemId) => {
      const otherRating = otherRatings.get(itemId);
      if (otherRating !== undefined) {
        dotProduct += rating * otherRating;
        normA += rating * rating;
        normB += otherRating * otherRating;
      }
    });
    
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
    
    // Recommend items the similar user liked but current user hasn't tried
    otherRatings.forEach((rating, itemId) => {
      if (!userRatings.has(itemId)) {
        const currentScore = itemScores.get(itemId) || 0;
        itemScores.set(itemId, currentScore + similarity * rating);
      }
    });
  });
  
  // Sort and return top N
  return Array.from(itemScores.entries())
    .map(([itemId, score]) => ({ itemId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
