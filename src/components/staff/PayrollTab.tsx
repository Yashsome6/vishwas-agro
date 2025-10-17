import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, Calendar, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportUtils";

export default function PayrollTab() {
  const { data } = useAppData();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const calculatePayroll = (employee: any) => {
    const monthlyAttendance = data.attendance.filter((att: any) => 
      att.employeeId === employee.id && att.date.startsWith(selectedMonth)
    );

    const presentDays = monthlyAttendance.filter((att: any) => att.status === "present").length;
    const halfDays = monthlyAttendance.filter((att: any) => att.status === "half-day").length;
    const totalWorkingDays = 26; // Standard working days
    
    const effectiveDays = presentDays + (halfDays * 0.5);
    const dailyWage = employee.salary / totalWorkingDays;
    const grossSalary = dailyWage * effectiveDays;
    
    const pf = grossSalary * 0.12; // 12% PF
    const tax = grossSalary > 50000 ? grossSalary * 0.1 : 0; // 10% tax if > 50k
    const netSalary = grossSalary - pf - tax;

    return {
      presentDays,
      halfDays,
      grossSalary: Math.round(grossSalary),
      pf: Math.round(pf),
      tax: Math.round(tax),
      netSalary: Math.round(netSalary),
    };
  };

  const processPayroll = () => {
    toast({ 
      title: "Payroll processed successfully",
      description: `Payroll for ${new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} has been processed.`
    });
  };

  const downloadPayrollReport = () => {
    const reportData = data.employees.map((emp: any) => {
      const payroll = calculatePayroll(emp);
      return {
        Employee: emp.name,
        Department: emp.department,
        BaseSalary: emp.salary,
        PresentDays: payroll.presentDays,
        HalfDays: payroll.halfDays,
        GrossSalary: payroll.grossSalary,
        PF: payroll.pf,
        Tax: payroll.tax,
        NetSalary: payroll.netSalary
      };
    });
    exportToCSV(reportData, `payroll-${selectedMonth}`);
  };

  const totalGrossSalary = data.employees.reduce((sum: number, emp: any) => {
    return sum + calculatePayroll(emp).grossSalary;
  }, 0);

  const totalNetSalary = data.employees.reduce((sum: number, emp: any) => {
    return sum + calculatePayroll(emp).netSalary;
  }, 0);

  const totalDeductions = totalGrossSalary - totalNetSalary;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalGrossSalary.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Payroll</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalNetSalary.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDeductions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payroll Details</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button variant="outline" onClick={downloadPayrollReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={processPayroll}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Process Payroll
                </Button>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Days Present</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>PF (12%)</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.employees.map((employee: any) => {
                  const payroll = calculatePayroll(employee);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                      <TableCell>
                        {payroll.presentDays}
                        {payroll.halfDays > 0 && ` + ${payroll.halfDays} half`}
                      </TableCell>
                      <TableCell>₹{payroll.grossSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">-₹{payroll.pf.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">
                        {payroll.tax > 0 ? `-₹${payroll.tax.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₹{payroll.netSalary.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Total Gross Salary</span>
              <span className="text-lg font-semibold">₹{totalGrossSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Total Deductions (PF + Tax)</span>
              <span className="text-lg font-semibold text-red-600">-₹{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-medium">Total Net Payable</span>
              <span className="text-2xl font-bold text-green-600">₹{totalNetSalary.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
