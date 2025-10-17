import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SystemConfigTab() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    defaultGstRate: "18",
    defaultPaymentTerms: "Cash",
    stockAlertThreshold: "50",
    expiryAlertDays: "30",
    fiscalYearStart: "04",
  });

  const handleSave = () => {
    localStorage.setItem("systemConfig", JSON.stringify(config));
    toast({ 
      title: "System configuration updated",
      description: "Your system settings have been saved successfully."
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <div>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure regional preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={config.currency} onValueChange={(value) => setConfig({ ...config, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={config.dateFormat} onValueChange={(value) => setConfig({ ...config, dateFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select value={config.timeFormat} onValueChange={(value) => setConfig({ ...config, timeFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hour</SelectItem>
                  <SelectItem value="12h">12 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fiscal Year Start Month</Label>
              <Select value={config.fiscalYearStart} onValueChange={(value) => setConfig({ ...config, fiscalYearStart: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">January</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="07">July</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Defaults</CardTitle>
          <CardDescription>Set default values for transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default GST Rate (%)</Label>
              <Input
                type="number"
                value={config.defaultGstRate}
                onChange={(e) => setConfig({ ...config, defaultGstRate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Payment Terms</Label>
              <Select value={config.defaultPaymentTerms} onValueChange={(value) => setConfig({ ...config, defaultPaymentTerms: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit 15">Credit 15 Days</SelectItem>
                  <SelectItem value="Credit 30">Credit 30 Days</SelectItem>
                  <SelectItem value="Credit 45">Credit 45 Days</SelectItem>
                  <SelectItem value="Credit 60">Credit 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>Configure when to receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Low Stock Alert Threshold</Label>
              <Input
                type="number"
                value={config.stockAlertThreshold}
                onChange={(e) => setConfig({ ...config, stockAlertThreshold: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Alert when stock falls below this quantity</p>
            </div>

            <div className="space-y-2">
              <Label>Expiry Alert (Days Before)</Label>
              <Input
                type="number"
                value={config.expiryAlertDays}
                onChange={(e) => setConfig({ ...config, expiryAlertDays: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Alert when items are expiring within this many days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
