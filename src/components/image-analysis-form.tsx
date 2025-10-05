
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
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const initialState: ImageAnalysisState = {};

export function ImageAnalysisForm() {
  const [state, formAction] = useActionState(runImageAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);

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
            {imagePreview && (
              <div className="border rounded-md p-2">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className="mx-auto rounded-md object-contain"
                />
              </div>
            )}
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
            {state.result ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Anomalies Detected</h3>
                        <div className="flex items-center gap-2">
                            {state.result.anomaliesDetected ? (
                                <>
                                    <AlertTriangle className="text-destructive h-5 w-5" />
                                    <p className="text-destructive font-medium">Yes, anomalies were detected.</p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                                    <p className="text-green-500 font-medium">No anomalies were detected.</p>
                                </>
                            )}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Risk Assessment</h3>
                        <p className="text-muted-foreground">{state.result.riskAssessment}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Recommendation</h3>
                        <p className="text-muted-foreground">{state.result.recommendation}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Confidence Level</h3>
                        <div className="flex items-center gap-2">
                            <Progress value={state.result.confidenceLevel * 100} className="w-full" />
                            <span className="font-mono text-sm font-medium">{(state.result.confidenceLevel * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            ) : (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Awaiting Analysis</AlertTitle>
                    <AlertDescription>
                        Submit an image to begin the analysis process.
                    </AlertDescription>
                </Alert>
            )}