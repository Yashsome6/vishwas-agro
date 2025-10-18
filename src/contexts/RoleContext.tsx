import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * ⚠️ SECURITY WARNING ⚠️
 * This is a CLIENT-SIDE ONLY role system for demonstration purposes.
 * In a production environment, roles MUST be validated server-side.
 * Never trust client-side role checks for sensitive operations.
 * This implementation uses localStorage which can be easily manipulated.
 */

export type AppRole = "admin" | "manager" | "staff" | "viewer";

interface RoleContextType {
  currentRole: AppRole;
  setRole: (role: AppRole) => void;
  hasPermission: (requiredRole: AppRole) => boolean;
  allRoles: AppRole[];
}

const roleHierarchy: Record<AppRole, number> = {
  admin: 4,
  manager: 3,
  staff: 2,
  viewer: 1,
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<AppRole>(() => {
    const stored = localStorage.getItem("userRole");
    return (stored as AppRole) || "viewer";
  });

  useEffect(() => {
    localStorage.setItem("userRole", currentRole);
  }, [currentRole]);

  const setRole = (role: AppRole) => {
    setCurrentRole(role);
  };

  const hasPermission = (requiredRole: AppRole): boolean => {
    return roleHierarchy[currentRole] >= roleHierarchy[requiredRole];
  };

  const allRoles: AppRole[] = ["admin", "manager", "staff", "viewer"];

  return (
    <RoleContext.Provider value={{ currentRole, setRole, hasPermission, allRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}
