
"use server";

import { z } from "zod";
import {
  analyzeMedicalImage,
  MedicalImageAnalysisOutput,
} from "@/ai/flows/medical-image-analysis";
import {
  predictConditionAssessment,
  PredictConditionAssessmentOutput,
} from "@/ai/flows/predictive-condition-assessment";
import {
    earlyDiagnosisAndRiskAssessment,
    EarlyDiagnosisAndRiskAssessmentOutput,
} from "@/ai/flows/early-diagnosis-risk-assessment";

// Helper function to read file as Data URI
async function fileToDataUri(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
}

// === Medical Image Analysis Action ===

export type ImageAnalysisState = {
  result?: MedicalImageAnalysisOutput;
  error?: string;
};

const imageAnalysisSchema = z.object({
  description: z.string().min(1, "Description is required."),
  image: z.instanceof(File).refine(file => file.size > 0, "An image file is required."),
});

export async function runImageAnalysis(
  prevState: ImageAnalysisState,
  formData: FormData
): Promise<ImageAnalysisState> {
  try {
    const validatedFields = imageAnalysisSchema.safeParse({
      description: formData.get("description"),
      image: formData.get("image"),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors.image?.[0] || validatedFields.error.flatten().fieldErrors.description?.[0] || "Invalid input." };
    }
    
    const { image, description } = validatedFields.data;
    const photoDataUri = await fileToDataUri(image);

    const result = await analyzeMedicalImage({ photoDataUri, description });
    return { result };
  } catch (e: any) {
    return { error: e.message || "An unexpected error occurred." };
  }
}

// === Predictive Condition Assessment Action ===

export type PredictiveAssessmentState = {
  result?: PredictConditionAssessmentOutput;
  error?: string;
};

const predictiveAssessmentSchema = z.object({
    patientHistory: z.string().min(10, "Patient history must be at least 10 characters."),
    labResults: z.string().min(10, "Lab results must be at least 10 characters."),
    monitoringData: z.string().min(10, "Monitoring data must be at least 10 characters."),
});

export async function runPredictiveAssessment(
    prevState: PredictiveAssessmentState,
    formData: FormData
): Promise<PredictiveAssessmentState> {
    try {
        const validatedFields = predictiveAssessmentSchema.safeParse({
            patientHistory: formData.get("patientHistory"),
            labResults: formData.get("labResults"),
            monitoringData: formData.get("monitoringData"),
        });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            return { error: Object.values(errors).flat()[0] || "Invalid input." };
        }

        const result = await predictConditionAssessment(validatedFields.data);
        return { result };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}


// === Early Diagnosis and Risk Assessment Action ===

export type EarlyDiagnosisState = {
    result?: EarlyDiagnosisAndRiskAssessmentOutput;
    error?: string;
  };
  
  const earlyDiagnosisSchema = z.object({
    ehrData: z.string().min(10, "EHR data must be at least 10 characters."),
    patientMonitoringData: z.string().min(10, "Patient monitoring data must be at least 10 characters."),
    image: z.instanceof(File).refine(file => file.size > 0, "An image file is required."),
  });
  
  export async function runEarlyDiagnosis(
    prevState: EarlyDiagnosisState,
    formData: FormData
  ): Promise<EarlyDiagnosisState> {
    try {
      const validatedFields = earlyDiagnosisSchema.safeParse({
        ehrData: formData.get("ehrData"),
        patientMonitoringData: formData.get("patientMonitoringData"),
        image: formData.get("image"),
      });
  
      if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return { error: Object.values(errors).flat()[0] || "Invalid input." };
      }
      
      const { image, ehrData, patientMonitoringData } = validatedFields.data;
      const medicalImageDataUri = await fileToDataUri(image);
  
      const result = await earlyDiagnosisAndRiskAssessment({ 
        medicalImageDataUri, 
        ehrData,
        patientMonitoringData,
      });
      return { result };
    } catch (e: any) {
      return { error: e.message || "An unexpected error occurred." };
    }
  }
