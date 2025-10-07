
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
import { healthChat } from "@/ai/flows/health-chat";
import { analyzeSymptoms, SymptomAnalysisOutput } from "@/ai/flows/symptom-analyzer";
import { generateHealthReport, GenerateHealthReportOutput } from "@/ai/flows/health-report-generator";
import { summarizeChat, ChatSummarizerOutput } from "@/ai/flows/chat-summarizer";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from 'firebase-admin/firestore';
import { initAdmin } from "@/firebase/server-init";

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


// === Health Chat Action ===

const messageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const chatSchema = z.object({
  history: z.array(messageSchema),
});

export async function runHealthChat(
    formData: FormData
  ): Promise<{ response: string } | { error: string }> {
      try {
          const validatedFields = chatSchema.safeParse({
              history: JSON.parse(formData.get("history") as string),
          });

          if (!validatedFields.success) {
              return { error: "Invalid input." };
          }
          
          const response = await healthChat(validatedFields.data);
          return { response };

      } catch (e: any) {
          return { error: e.message || "An unexpected error occurred." };
      }
  }

  // === Symptom Analyzer Action ===

export type SymptomAnalyzerState = {
    result?: SymptomAnalysisOutput;
    error?: string;
};

const symptomAnalyzerSchema = z.object({
    symptoms: z.string().min(10, "Please describe your symptoms in at least 10 characters."),
});

export async function runSymptomAnalysis(
    prevState: SymptomAnalyzerState,
    formData: FormData
): Promise<SymptomAnalyzerState> {
    try {
        const validatedFields = symptomAnalyzerSchema.safeParse({
            symptoms: formData.get("symptoms"),
        });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            return { error: Object.values(errors).flat()[0] || "Invalid input." };
        }

        const result = await analyzeSymptoms({symptoms: validatedFields.data.symptoms});
        return { result };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}

// === Health Report Generation Action ===

export type HealthReportState = {
    result?: GenerateHealthReportOutput;
    error?: string;
};

const healthReportSchema = z.object({
    healthData: z.string().min(20, "Please provide more detailed health data for an accurate report."),
});

export async function runHealthReportGeneration(
    prevState: HealthReportState,
    formData: FormData
): Promise<HealthReportState> {
    try {
        const validatedFields = healthReportSchema.safeParse({
            healthData: formData.get("healthData"),
        });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            return { error: Object.values(errors).flat()[0] || "Invalid input." };
        }

        const result = await generateHealthReport({healthData: validatedFields.data.healthData});
        return { result };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}


// === Chat Summarization and Saving Action ===
export type ChatSummaryState = {
    result?: ChatSummarizerOutput;
    error?: string;
};

export async function runChatSummarization(
    prevState: ChatSummaryState,
    formData: FormData
): Promise<ChatSummaryState> {
    try {
        const validatedFields = chatSchema.safeParse({
            history: JSON.parse(formData.get("history") as string),
        });

        if (!validatedFields.success) {
            return { error: "Invalid chat history." };
        }

        const { history } = validatedFields.data;

        // 1. Summarize the chat
        const summaryResult = await summarizeChat({ history });

        // 2. Save the chat to Firestore
        const app = initAdmin();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        
        // This is a simplified way to get the current user.
        // In a real app, you'd get this from the session.
        const users = await auth.listUsers();
        if (users.users.length === 0) {
            // This is a fallback and ideally you should have a proper session management
            return { error: "No authenticated user found to save the chat." };
        }
        const userId = users.users[0].uid;


        await firestore.collection('users').doc(userId).collection('chats').add({
            userId: userId,
            createdAt: FieldValue.serverTimestamp(),
            messages: history,
            summary: summaryResult.summary,
        });

        return { result: summaryResult };
    } catch (e: any) {
        console.error("Chat summarization/saving error:", e);
        return { error: e.message || "An unexpected error occurred during summarization." };
    }
}

    