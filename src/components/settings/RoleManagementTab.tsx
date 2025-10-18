import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

export default function RoleManagementTab() {
  const { currentRole, setRole, allRoles, hasPermission } = useRole();

  const roleDescriptions = {
    admin: "Full system access - can manage all features, users, and settings",
    manager: "Can manage operations, view reports, and configure workflows",
    staff: "Can perform daily operations and data entry",
    viewer: "Read-only access to view data and reports",
  };

  const roleColors = {
    admin: "destructive",
    manager: "default",
    staff: "secondary",
    viewer: "outline",
  } as const;

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> This is a demonstration of role-based access control using client-side storage.
          In production, role validation MUST be performed server-side to prevent privilege escalation attacks.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Role
          </CardTitle>
          <CardDescription>
            Your current access level in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={currentRole} onValueChange={setRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant={roleColors[currentRole]}>
              {currentRole.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {roleDescriptions[currentRole]}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Matrix</CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allRoles.map((role) => (
              <div key={role} className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge variant={roleColors[role]} className="mt-1">
                  {role.toUpperCase()}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 capitalize">{role}</h4>
                  <p className="text-sm text-muted-foreground">
                    {roleDescriptions[role]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {role === "admin" && (
                      <>
                        <Badge variant="outline" className="text-xs">User Management</Badge>
                        <Badge variant="outline" className="text-xs">System Config</Badge>
                        <Badge variant="outline" className="text-xs">All Modules</Badge>
                      </>
                    )}
                    {role === "manager" && (
                      <>
                        <Badge variant="outline" className="text-xs">Reports & Analytics</Badge>
                        <Badge variant="outline" className="text-xs">Workflow Config</Badge>
                        <Badge variant="outline" className="text-xs">Operations</Badge>
                      </>
                    )}
                    {role === "staff" && (
                      <>
                        <Badge variant="outline" className="text-xs">Data Entry</Badge>
                        <Badge variant="outline" className="text-xs">Basic Operations</Badge>
                        <Badge variant="outline" className="text-xs">View Reports</Badge>
                      </>
                    )}
                    {role === "viewer" && (
                      <>
                        <Badge variant="outline" className="text-xs">Read-Only Access</Badge>
                        <Badge variant="outline" className="text-xs">View Reports</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
