import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySettingsTab from "@/components/settings/CompanySettingsTab";
import UserPreferencesTab from "@/components/settings/UserPreferencesTab";
import SystemConfigTab from "@/components/settings/SystemConfigTab";
import BackupRestoreTab from "@/components/settings/BackupRestoreTab";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your system preferences and business settings</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <CompanySettingsTab />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <UserPreferencesTab />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemConfigTab />
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <BackupRestoreTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
