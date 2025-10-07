
"use client";

import { useActionState, useEffect, useRef } from "react";
import { SymptomAnalyzerState, runSymptomAnalysis } from "@/app/actions";
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
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const initialState: SymptomAnalyzerState = {};

export function SymptomAnalyzerForm() {
  const [state, formAction] = useActionState(runSymptomAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
    if (state.result) {
        toast({
            title: "Analysis Complete",
            description: "The symptom analysis has been successfully generated.",
            action: <CheckCircle className="text-green-500" />,
        });
    }
  }, [state, toast]);

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
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Provide a detailed description of your symptoms for the AI to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptom Description</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="e.g., I have a persistent dry cough, a low-grade fever, and feel very fatigued..."
                required
                rows={8}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton>Analyze Symptoms</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            The AI's preliminary analysis will appear here.
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
                  <h3 className="font-semibold mb-2">Potential Conditions</h3>
                  <p className="text-muted-foreground">
                    {state.result.potentialConditions}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <p className="text-muted-foreground">
                    {state.result.recommendations}
                  </p>
                </div>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription>
                    {state.result.disclaimer}
                  </AlertDescription>
                </Alert>
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
                  <AlertTitle>Awaiting Symptoms</AlertTitle>
                  <AlertDescription>
                    Enter your symptoms in the form to get an analysis.
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
