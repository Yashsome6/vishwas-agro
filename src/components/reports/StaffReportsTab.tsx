import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Calendar, Download } from "lucide-react";
import { useState } from "react";

export default function StaffReportsTab() {
  const { data } = useAppData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const totalEmployees = data.employees.length;
  const totalMonthlySalary = data.employees.reduce((sum: number, emp: any) => sum + emp.salary, 0);

  const monthlyAttendance = data.attendance.filter((att: any) => 
    att.date.startsWith(selectedMonth)
  );

  const avgAttendanceRate = totalEmployees > 0
    ? (monthlyAttendance.filter((att: any) => att.status === "present").length / 
       (totalEmployees * new Date().getDate())) * 100
    : 0;

  const departmentWiseStats = Array.from(
    new Set(data.employees.map((emp: any) => emp.department))
  ).map((dept) => {
    const deptEmployees = data.employees.filter((emp: any) => emp.department === dept);
    const deptSalary = deptEmployees.reduce((sum: number, emp: any) => sum + emp.salary, 0);
    
    const deptAttendance = monthlyAttendance.filter((att: any) => {
      const employee = data.employees.find((emp: any) => emp.id === att.employeeId);
      return employee && employee.department === dept;
    });

    const presentCount = deptAttendance.filter((att: any) => att.status === "present").length;
    const totalPossible = deptEmployees.length * new Date().getDate();
    const attendanceRate = totalPossible > 0 ? (presentCount / totalPossible) * 100 : 0;

    return {
      department: dept,
      employeeCount: deptEmployees.length,
      totalSalary: deptSalary,
      attendanceRate: attendanceRate.toFixed(1),
    };
  });

  const employeePerformance = data.employees.map((emp: any) => {
    const empAttendance = monthlyAttendance.filter((att: any) => att.employeeId === emp.id);
    const presentDays = empAttendance.filter((att: any) => att.status === "present").length;
    const absentDays = empAttendance.filter((att: any) => att.status === "absent").length;
    const halfDays = empAttendance.filter((att: any) => att.status === "half-day").length;
    const totalDays = empAttendance.length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      ...emp,
      presentDays,
      absentDays,
      halfDays,
      totalDays,
      attendanceRate: attendanceRate.toFixed(1),
    };
  }).sort((a: any, b: any) => parseFloat(b.attendanceRate) - parseFloat(a.attendanceRate));

  const downloadReport = () => {
    alert("Staff report export functionality");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalMonthlySalary.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendanceRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentWiseStats.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Department-wise Analysis</CardTitle>
              <Button onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Monthly Salary</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentWiseStats.map((dept: any) => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>{dept.employeeCount}</TableCell>
                      <TableCell>₹{dept.totalSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {dept.attendanceRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentWiseStats.map((dept: any) => (
                <div key={dept.department}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{dept.totalSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(dept.totalSalary / totalMonthlySalary) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Performance Report</CardTitle>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Half Day</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-right">Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeePerformance.map((emp: any) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell className="text-green-600">{emp.presentDays}</TableCell>
                    <TableCell className="text-red-600">{emp.absentDays}</TableCell>
                    <TableCell className="text-orange-600">{emp.halfDays}</TableCell>
                    <TableCell>₹{emp.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {emp.attendanceRate}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
