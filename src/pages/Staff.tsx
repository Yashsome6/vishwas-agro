import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeesTab from "@/components/staff/EmployeesTab";
import AttendanceTab from "@/components/staff/AttendanceTab";
import PayrollTab from "@/components/staff/PayrollTab";

export default function Staff() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">Manage employees, attendance, and payroll</p>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <EmployeesTab />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
