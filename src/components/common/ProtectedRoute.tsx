import { ReactNode } from "react";
import { useRole, AppRole } from "@/contexts/RoleContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: AppRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { hasPermission } = useRole();

  if (!hasPermission(requiredRole)) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Required role: {requiredRole}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
