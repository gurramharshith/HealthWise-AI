
import { HealthReportForm } from "@/components/health-report-form";
import { FileText } from "lucide-react";

export default function HealthReportPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Health Report Generator
          </h1>
          <p className="text-muted-foreground">
            Generate a comprehensive AI-powered health report based on your data.
          </p>
        </div>
      </header>
      <HealthReportForm />
    </div>
  );
}
