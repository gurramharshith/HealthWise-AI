
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ImageAnalysisState,
  runImageAnalysis,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, CheckCircle2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion, useSpring } from "framer-motion";

const initialState: ImageAnalysisState = {};

export function ImageAnalysisForm() {
  const [state, formAction] = useActionState(runImageAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const confidence = state.result?.confidenceLevel || 0;
  const progressSpring = useSpring(0, {
    damping: 15,
    stiffness: 100,
  });

  useEffect(() => {
    progressSpring.set(confidence * 100);
  }, [confidence, progressSpring]);

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
            description: "The medical image has been successfully analyzed.",
            action: <CheckCircle className="text-green-500" />,
        });
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
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Provide an image file and a brief description for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Medical Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} required />
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., Chest X-ray of a 58-year-old male, non-smoker, with a persistent cough."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton>Analyze Image</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
                The AI's assessment will appear here.
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
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="space-y-6"
                >
                    {state.result.anomaliesDetected ? (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Anomalies Detected</AlertTitle>
                            <AlertDescription>
                                The AI has detected potential anomalies in the image. Please review the assessment below.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
                             <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertTitle>No Anomalies Detected</AlertTitle>
                            <AlertDescription>
                                The AI analysis did not find any significant anomalies.
                            </AlertDescription>
                        </Alert>
                    )}

                     <motion.div variants={cardVariants}>
                        <h3 className="font-semibold mb-2">Risk Assessment</h3>
                        <p className="text-muted-foreground">{state.result.riskAssessment}</p>
                    </motion.div>
                     <motion.div variants={cardVariants}>
                        <h3 className="font-semibold mb-2">Recommendation</h3>
                        <p className="text-muted-foreground">{state.result.recommendation}</p>
                    </motion.div>
                     <motion.div variants={cardVariants}>
                        <h3 className="font-semibold mb-2">Confidence Level</h3>
                        <div className="flex items-center gap-2">
                            <Progress value={progressSpring.get()} asMotion />
                             <motion.span className="font-mono text-sm font-medium tabular-nums">{progressSpring.to(v => `${v.toFixed(0)}%`)}</motion.span>
                        </div>
                    </motion.div>
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
                        <AlertTitle>Awaiting Analysis</AlertTitle>
                        <AlertDescription>
                            Submit an image to begin the analysis process.
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

    