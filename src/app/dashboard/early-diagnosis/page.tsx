
import { EarlyDiagnosisForm } from "@/components/early-diagnosis-form";
import { Stethoscope } from "lucide-react";

export default function EarlyDiagnosisPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Comprehensive Early Diagnosis
          </h1>
          <p className="text-muted-foreground">
            Combine image, EHR, and monitoring data for a holistic diagnosis.
          </p>
        </div>
      </header>
      <EarlyDiagnosisForm />
    </div>
  );
}
