
import { SymptomAnalyzerForm } from "@/components/symptom-analyzer-form";
import { Search } from "lucide-react";

export default function SymptomAnalyzerPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Symptom Analyzer
          </h1>
          <p className="text-muted-foreground">
            Describe your symptoms for a preliminary AI analysis.
          </p>
        </div>
      </header>
      <SymptomAnalyzerForm />
    </div>
  );
}
