import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserPreferencesTab() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem("theme") || "light",
    notifications: true,
    emailAlerts: true,
    lowStockAlerts: true,
    autoSave: true,
    compactView: false,
  });

  const handleSave = () => {
    localStorage.setItem("theme", preferences.theme);
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    toast({ 
      title: "Preferences saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
            </div>
            <Select 
              value={preferences.theme} 
              onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact View</Label>
              <p className="text-sm text-muted-foreground">Show more data in less space</p>
            </div>
            <Switch
              checked={preferences.compactView}
              onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Get important updates via email</p>
            </div>
            <Switch
              checked={preferences.emailAlerts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, emailAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Alert when inventory is running low</p>
            </div>
            <Switch
              checked={preferences.lowStockAlerts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, lowStockAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Control how your data is saved</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
            </div>
            <Switch
              checked={preferences.autoSave}
              onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
