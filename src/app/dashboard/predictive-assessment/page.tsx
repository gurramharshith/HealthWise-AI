
import { PredictiveAssessmentForm } from "@/components/predictive-assessment-form";
import { BrainCircuit } from "lucide-react";

export default function PredictiveAssessmentPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <BrainCircuit className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Predictive Condition Assessment
          </h1>
          <p className="text-muted-foreground">
            Input patient data to predict potential health conditions.
          </p>
        </div>
      </header>
      <PredictiveAssessmentForm />
    </div>
  );
}
