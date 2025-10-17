import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, AlertCircle, Info } from "lucide-react";
import { useAppData } from "@/contexts/AppContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportToJSON } from "@/lib/exportUtils";
import { showSuccess, showError } from "@/lib/alertUtils";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useState } from "react";

export default function BackupRestoreTab() {
  const { data, updateData } = useAppData();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: data,
    };
    exportToJSON(backup, "agro-erp-backup");
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        if (backup.data) {
          // Restore all data
          Object.keys(backup.data).forEach((key) => {
            updateData(key as any, backup.data[key]);
          });

          showSuccess("Data restored successfully", `Backup from ${new Date(backup.timestamp).toLocaleDateString()} has been restored.`);
        } else {
          throw new Error("Invalid backup file format");
        }
      } catch (error) {
        showError("Restore failed", "The backup file is invalid or corrupted.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    localStorage.removeItem("agroErpData");
    showSuccess("Data cleared", "All data has been removed. The page will reload.");
    setTimeout(() => window.location.reload(), 1000);
  };

  const getDataSize = () => {
    const dataStr = JSON.stringify(data);
    const bytes = new Blob([dataStr]).size;
    return (bytes / 1024).toFixed(2) + " KB";
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Regular backups help protect your business data. Download a backup file and store it safely.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <div>
              <CardTitle>Data Backup</CardTitle>
              <CardDescription>Export your data to a backup file</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Current Data Size</p>
              <p className="text-sm text-muted-foreground">{getDataSize()}</p>
            </div>
            <Button onClick={handleBackup}>
              <Download className="mr-2 h-4 w-4" />
              Download Backup
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="font-medium">Stock Items</p>
              <p className="text-2xl font-bold text-primary">{data.stock.length}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="font-medium">Sales Invoices</p>
              <p className="text-2xl font-bold text-primary">{data.sales.length}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="font-medium">Purchase Vouchers</p>
              <p className="text-2xl font-bold text-primary">{data.purchases.length}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="font-medium">Employees</p>
              <p className="text-2xl font-bold text-primary">{data.employees.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <div>
              <CardTitle>Data Restore</CardTitle>
              <CardDescription>Import data from a backup file</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Restoring a backup will replace all current data. Make sure to create a backup first.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Backup File
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div>
              <p className="font-medium text-destructive">Clear All Data</p>
              <p className="text-sm text-muted-foreground">Permanently delete all data from the system</p>
            </div>
            <Button variant="destructive" onClick={() => setShowClearDialog(true)}>
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear All Data"
        description="⚠️ WARNING: This will permanently delete ALL data from the system. This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Yes, Clear All Data"
        cancelLabel="Cancel"
        onConfirm={handleClearData}
        variant="destructive"
      />
    </div>
  );
}
