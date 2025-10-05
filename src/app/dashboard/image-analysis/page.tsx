
import { ImageAnalysisForm } from "@/components/image-analysis-form";
import { FileScan } from "lucide-react";

export default function ImageAnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <FileScan className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Medical Image Analysis
          </h1>
          <p className="text-muted-foreground">
            Upload an image to detect anomalies and potential health issues.
          </p>
        </div>
      </header>
      <ImageAnalysisForm />
    </div>
  );
}
