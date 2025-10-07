
"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  PredictiveAssessmentState,
  runPredictiveAssessment,
} from "@/app/actions";
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
import { Info, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const initialState: PredictiveAssessmentState = {};

export function PredictiveAssessmentForm() {
  const [state, formAction] = useActionState(
    runPredictiveAssessment,
    initialState
  );
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: state.error,
      });
    }
    if (state.result) {
        toast({
            title: "Assessment Complete",
            description: "The predictive assessment has been successfully generated.",
            action: <CheckCircle className="text-green-500" />,
        });
    }
  }, [state, toast]);

  useEffect(() => {
    if (state.result) {
        formRef.current?.reset();
    }
  }, [state.result])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form action={formAction} ref={formRef}>
          <CardHeader>
            <CardTitle>Enter Patient Data</CardTitle>
            <CardDescription>
              Provide patient history, lab results, and monitoring data for
              predictive analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientHistory">Patient History</Label>
              <Textarea
                id="patientHistory"
                name="patientHistory"
                placeholder="e.g., 65-year-old male with a history of hypertension and type 2 diabetes..."
                required
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labResults">Lab Results</Label>
              <Textarea
                id="labResults"
                name="labResults"
                placeholder="e.g., HbA1c: 7.5%, Cholesterol: 220 mg/dL, Creatinine: 1.4 mg/dL..."
                required
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoringData">Patient Monitoring Data</Label>
              <Textarea
                id="monitoringData"
                name="monitoringData"
                placeholder="e.g., Average daily steps: 3500, Resting heart rate: 85 bpm, Blood pressure: 145/90 mmHg..."
                required
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton>Run Assessment</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            The AI's prediction will appear here.
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
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold mb-2">Condition Predictions</h3>
                  <p className="text-muted-foreground">
                    {state.result.conditionPredictions}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Overall Risk Assessment</h3>
                  <p className="text-muted-foreground">
                    {state.result.riskAssessment}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <p className="text-muted-foreground">
                    {state.result.recommendations}
                  </p>
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
                  <AlertTitle>Awaiting Assessment</AlertTitle>
                  <AlertDescription>
                    Submit patient data to begin the assessment process.
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
