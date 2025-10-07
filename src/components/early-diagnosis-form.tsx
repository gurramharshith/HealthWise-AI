
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EarlyDiagnosisState, runEarlyDiagnosis } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, ShieldCheck, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const initialState: EarlyDiagnosisState = {};

export function EarlyDiagnosisForm() {
  const [state, formAction] = useActionState(runEarlyDiagnosis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Diagnosis Failed",
        description: state.error,
      });
    }
    if (state.result) {
        if(state.result.warrantsReview) {
            toast({
                variant: "destructive",
                title: "Critical Alert: Professional Review Required",
                description:
                  "The AI has flagged this case as requiring immediate review by a qualified healthcare professional.",
                duration: 10000,
              });
        } else {
            toast({
                title: "Diagnosis Complete",
                description: "The comprehensive diagnosis has been successfully generated.",
                action: <CheckCircle className="text-green-500" />,
            });
        }
    }
  }, [state, toast]);
  
  useEffect(() => {
    if (state.result) {
        formRef.current?.reset();
        setImagePreview(null);
    }
  }, [state.result])


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form action={formAction} ref={formRef}>
          <CardHeader>
            <CardTitle>Provide Comprehensive Data</CardTitle>
            <CardDescription>
              Submit all available data for the most accurate early diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Medical Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
             <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-md p-2 overflow-hidden"
                >
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-md object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <Label htmlFor="ehrData">Electronic Health Records (EHR)</Label>
              <Textarea
                id="ehrData"
                name="ehrData"
                placeholder="Paste relevant sections of the patient's EHR data here."
                required
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientMonitoringData">
                Patient Monitoring Data
              </Label>
              <Textarea
                id="patientMonitoringData"
                name="patientMonitoringData"
                placeholder="Enter recent data from wearable devices or monitoring systems."
                required
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton>Run Diagnosis</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Results</CardTitle>
          <CardDescription>
            The AI's comprehensive diagnosis will appear here.
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
                {state.result.warrantsReview ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Professional Review Required</AlertTitle>
                    <AlertDescription>
                      This case has been flagged for immediate professional
                      review.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <AlertTitle>No Critical Flags</AlertTitle>
                    <AlertDescription>
                      The AI analysis did not find indicators requiring immediate professional review. Standard procedures should be followed.
                    </AlertDescription>
                  </Alert>
                )}
                <div>
                  <h3 className="font-semibold mb-2">Early Diagnosis</h3>
                  <p className="text-muted-foreground">{state.result.diagnosis}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Risk Assessment</h3>
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
                  <AlertTitle>Awaiting Diagnosis</AlertTitle>
                  <AlertDescription>
                    Submit patient data to begin the diagnostic process.
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
