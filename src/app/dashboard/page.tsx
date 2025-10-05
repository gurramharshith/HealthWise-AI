
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  FileText,
  Scan,
  Users,
} from "lucide-react";
import {
  mockConditionDistribution,
  mockDashboardStats,
  mockPatients,
  mockPatientVitals,
} from "@/lib/data";

const riskVariantMap = {
  Low: "default",
  Medium: "secondary",
  High: "outline",
  Critical: "destructive",
} as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your HealthWise AI overview.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High-Risk Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.highRiskAlerts}</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Images Analyzed Today
            </CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.imagesAnalyzed}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
            <CardDescription>
              Distribution of predicted conditions across the patient population.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockConditionDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient Vitals Trend</CardTitle>
            <CardDescription>
              Average patient vital signs over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPatientVitals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bloodPressure"
                  name="Blood Pressure"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>
            A list of the most recent patient diagnostic assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-center">Risk Level</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="portrait face" />
                        <AvatarFallback>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={riskVariantMap[patient.riskLevel]}>
                      {patient.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
