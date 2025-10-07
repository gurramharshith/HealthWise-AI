
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  AlertTriangle,
  FileScan,
  Users,
} from "lucide-react";
import {
  mockConditionDistribution,
  mockDashboardStats,
  mockPatients,
  mockPatientVitals,
} from "@/lib/data";
import { useUser } from "@/firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const riskVariantMap = {
  Low: "default",
  Medium: "secondary",
  High: "outline",
  Critical: "destructive",
} as const;

export default function DashboardPage() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.displayName?.split(' ')[0] || 'Doctor'}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a summary of your clinic&apos;s activity today.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalPatients.toLocaleString()}</div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardFooter>
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
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Images Analyzed
            </CardTitle>
            <FileScan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.imagesAnalyzed}</div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Vitals Trend</CardTitle>
            <CardDescription>
              Average patient vital signs over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockPatientVitals} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                 <defs>
                  <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="hsl(var(--primary))" fill="url(#colorHeartRate)" strokeWidth={2} isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
             <CardDescription>
              Distribution of predicted conditions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockConditionDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  cursor={{fill: 'hsl(var(--accent))'}}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={true} />
              </BarChart>
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
          <Accordion type="single" collapsible className="w-full">
            {mockPatients.map((patient) => (
              <AccordionItem value={`item-${patient.id}`} key={patient.id}>
                <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                   <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="portrait face" />
                        <AvatarFallback>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-left">{patient.name}</span>
                    </div>
                    <div className="text-center flex-1">
                      <Badge variant={riskVariantMap[patient.riskLevel]} className="capitalize w-20 justify-center">
                        {patient.riskLevel.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="text-right flex-1 text-muted-foreground">{patient.date}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/20 rounded-md mt-2 border">
                    <h4 className="font-semibold mb-2">Condition Details</h4>
                    <p className="text-muted-foreground">{patient.condition}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
