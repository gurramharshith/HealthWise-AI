
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
  mockPatientVitals,
} from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, collectionGroup } from "firebase/firestore";
import type { Patient, Diagnosis } from "@/lib/types";

const riskVariantMap = {
  Low: "default",
  Medium: "secondary",
  High: "outline",
  Critical: "destructive",
} as const;

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const patientsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'patients'), orderBy('lastName')) : null),
    [firestore]
  );
  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  
  const diagnosesQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'diagnoses'), orderBy('diagnosisDate', 'desc')) : null),
    [firestore]
  );
  const { data: diagnoses, isLoading: isLoadingDiagnoses } = useCollection<Diagnosis>(diagnosesQuery);


  const patientMap = useMemoFirebase(() => {
    if (!patients) return {};
    return patients.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
  }, [patients]);
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: i * 0.1,
      },
    }),
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <motion.header 
        className="space-y-1"
        initial="hidden"
        animate="visible"
        variants={sectionVariants()}
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.displayName?.split(' ')[0] || 'Doctor'}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          Here&apos;s a summary of your clinic&apos;s activity today.
        </motion.p>
      </motion.header>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={sectionVariants(0.2)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients?.length ?? mockDashboardStats.totalPatients}</div>
            </CardContent>
             <CardFooter>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High-Risk Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diagnoses?.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').length ?? mockDashboardStats.highRiskAlerts}</div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={sectionVariants(0.4)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
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
        </motion.div>
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      <motion.div
         variants={sectionVariants(0.6)}
         initial="hidden"
         animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>
              A list of the most recent patient diagnostic assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {isLoadingDiagnoses && <p>Loading assessments...</p>}
              {diagnoses?.map((diagnosis) => {
                 const patient: Patient | undefined = (patientMap as any)[diagnosis.patientId];
                 if (!patient) return null;
                 
                 const patientName = `${patient.firstName} ${patient.lastName}`;

                 return (
                    <AccordionItem value={`item-${diagnosis.id}`} key={diagnosis.id}>
                      <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                         <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://picsum.photos/seed/${patient.id}/100/100`} alt={patientName} data-ai-hint="portrait face" />
                              <AvatarFallback>
                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-left">{patientName}</span>
                          </div>
                          <div className="text-center flex-1">
                            <Badge variant={riskVariantMap[diagnosis.riskLevel]} className="capitalize w-20 justify-center">
                              {diagnosis.riskLevel.toLowerCase()}
                            </Badge>
                          </div>
                          <div className="text-right flex-1 text-muted-foreground">{new Date(diagnosis.diagnosisDate).toLocaleDateString()}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted/20 rounded-md mt-2 border">
                          <h4 className="font-semibold mb-2">{diagnosis.condition}</h4>
                          <p className="text-muted-foreground">{diagnosis.notes || 'No additional notes.'}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                 )
              })}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
