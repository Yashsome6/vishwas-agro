import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Upload, Database, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/indexedDB";
import { errorHandler } from "@/lib/errorHandler";

export default function ProductionSettingsTab() {
  const { toast } = useToast();

  const handleBackupCreate = async () => {
    try {
      const backupJson = await db.createBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erp-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: "Your data has been backed up successfully",
      });
    } catch (error) {
      errorHandler.logError({
        severity: 'error',
        message: 'Failed to create backup',
        context: { error },
      });
      toast({
        title: "Backup Failed",
        description: "Could not create backup. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const dataJson = await db.exportToJSON();
      const blob = new Blob([dataJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erp-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully",
      });
    } catch (error) {
      errorHandler.logError({
        severity: 'error',
        message: 'Failed to export data',
        context: { error },
      });
      toast({
        title: "Export Failed",
        description: "Could not export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await db.importFromJSON(text);

        toast({
          title: "Data Imported",
          description: "Your data has been imported successfully. Please refresh the page.",
        });
      } catch (error) {
        errorHandler.logError({
          severity: 'error',
          message: 'Failed to import data',
          context: { error },
        });
        toast({
          title: "Import Failed",
          description: "Could not import data. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const errorStats = errorHandler.getErrorStats();

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>⚠️ Production Readiness Notice:</strong> This system is currently using client-side storage.
          For production deployment with multi-user support, real-time sync, and enhanced security, 
          enable Lovable Cloud for proper backend infrastructure.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Backup, restore, and manage your application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleBackupCreate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button onClick={handleImportData} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Regular backups are recommended. Data is stored locally in your browser's IndexedDB.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>
            Current security configuration and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Authentication</span>
              <span className="text-sm font-medium text-yellow-600">Client-side only</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Data Storage</span>
              <span className="text-sm font-medium text-yellow-600">Browser IndexedDB</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Role Validation</span>
              <span className="text-sm font-medium text-yellow-600">Client-side only</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Multi-user Support</span>
              <span className="text-sm font-medium text-red-600">Not available</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Error Tracking</span>
              <span className="text-sm font-medium text-green-600">
                {errorStats.total} logged ({errorStats.unresolved} unresolved)
              </span>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              For production deployment, enable Lovable Cloud to get:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Server-side authentication with JWT tokens</li>
                <li>PostgreSQL database with automatic backups</li>
                <li>Row-level security policies</li>
                <li>Real-time multi-user collaboration</li>
                <li>API rate limiting and monitoring</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Error Logs</CardTitle>
          <CardDescription>
            Recent system errors and warnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium mb-2">
              <span>Info: {errorStats.bySeverity.info}</span>
              <span>Warning: {errorStats.bySeverity.warning}</span>
              <span>Error: {errorStats.bySeverity.error}</span>
              <span>Critical: {errorStats.bySeverity.critical}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const logs = errorHandler.exportErrors();
                  const blob = new Blob([logs], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `error-logs-${new Date().toISOString()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export Logs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  errorHandler.clearResolvedErrors();
                  toast({ title: "Cleared resolved errors" });
                }}
              >
                Clear Resolved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
