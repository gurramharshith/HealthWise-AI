
"use client";

import { useActionState, useEffect, useRef } from "react";
import { HealthReportState, runHealthReportGeneration } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const initialState: HealthReportState = {};

export function HealthReportForm() {
  const [state, formAction] = useActionState(
    runHealthReportGeneration,
    initialState
  );
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (state.result) {
      formRef.current?.reset();
    }
  }, [state.result]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form action={formAction} ref={formRef}>
          <CardHeader>
            <CardTitle>Enter Your Health Data</CardTitle>
            <CardDescription>
              Provide your latest health information to generate a report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthData">Health Records</Label>
              <Textarea
                id="healthData"
                name="healthData"
                placeholder="e.g., Height: 180cm, Weight: 80kg, BP: 120/80, Allergies: None..."
                required
                rows={10}
              />
               <p className="text-xs text-muted-foreground">
                Please provide a summary of your health data. You can include information like height, weight, blood pressure, blood sugar, heart rate, medications, allergies, and existing medical conditions.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton>Generate Report</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Health Report</CardTitle>
          <CardDescription>
            Your personalized health summary will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {state.result ? (
              <motion.div
                key="result"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={cardVariants}
                transition={{ duration: 0.5 }}
                className="space-y-4 p-4 border rounded-lg bg-muted/30"
              >
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">Your Health Summary</h3>
                 </div>
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert whitespace-pre-wrap">
                    {state.result.reportContent}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={cardVariants}
                transition={{ duration: 0.5 }}
              >
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Awaiting Data</AlertTitle>
                  <AlertDescription>
                    Enter your health data in the form to generate a report.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
