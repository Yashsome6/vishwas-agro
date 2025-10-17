import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AttendanceTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const todayAttendance = data.attendance.filter((att: any) => 
    att.date.startsWith(selectedDate)
  );

  const monthlyAttendance = data.attendance.filter((att: any) => 
    att.date.startsWith(selectedMonth)
  );

  const markAttendance = (employeeId: string, status: string) => {
    const existing = todayAttendance.find((att: any) => att.employeeId === employeeId);
    
    if (existing) {
      const updated = data.attendance.map((att: any) =>
        att.employeeId === employeeId && att.date.startsWith(selectedDate)
          ? { ...att, status }
          : att
      );
      updateData("attendance", updated);
    } else {
      const newAttendance = {
        id: `att-${data.attendance.length + 1}`,
        employeeId,
        date: new Date().toISOString(),
        status,
        checkIn: status === "present" ? "09:00" : null,
        checkOut: status === "present" ? "18:00" : null,
      };
      updateData("attendance", [...data.attendance, newAttendance]);
    }
    
    toast({ title: `Attendance marked as ${status}` });
  };

  const getEmployeeAttendance = (employeeId: string) => {
    return todayAttendance.find((att: any) => att.employeeId === employeeId);
  };

  const getMonthlyStats = (employeeId: string) => {
    const empAttendance = monthlyAttendance.filter((att: any) => att.employeeId === employeeId);
    const present = empAttendance.filter((att: any) => att.status === "present").length;
    const absent = empAttendance.filter((att: any) => att.status === "absent").length;
    const halfDay = empAttendance.filter((att: any) => att.status === "half-day").length;
    
    return { present, absent, halfDay, total: empAttendance.length };
  };

  const presentCount = todayAttendance.filter((att: any) => att.status === "present").length;
  const absentCount = todayAttendance.filter((att: any) => att.status === "absent").length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Marked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.length - todayAttendance.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAttendance.length > 0 
                ? Math.round((presentCount / todayAttendance.length) * 100) 
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Attendance</CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
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
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Mark Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.employees.map((employee: any) => {
                  const attendance = getEmployeeAttendance(employee.id);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{attendance?.checkIn || "-"}</TableCell>
                      <TableCell>{attendance?.checkOut || "-"}</TableCell>
                      <TableCell>
                        {attendance ? (
                          <Badge
                            variant={
                              attendance.status === "present"
                                ? "default"
                                : attendance.status === "absent"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {attendance.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Marked</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAttendance(employee.id, "present")}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAttendance(employee.id, "half-day")}
                          >
                            Half Day
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAttendance(employee.id, "absent")}
                          >
                            Absent
                          </Button>
                        </div>
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
          <div className="flex items-center justify-between">
            <CardTitle>Monthly Summary</CardTitle>
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
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Half Day</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead className="text-right">Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.employees.map((employee: any) => {
                  const stats = getMonthlyStats(employee.id);
                  const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-green-600">{stats.present}</TableCell>
                      <TableCell className="text-red-600">{stats.absent}</TableCell>
                      <TableCell className="text-orange-600">{stats.halfDay}</TableCell>
                      <TableCell>{stats.total}</TableCell>
                      <TableCell className="text-right font-medium">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
