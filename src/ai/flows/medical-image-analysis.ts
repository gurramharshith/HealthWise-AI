'use server';

/**
 * @fileOverview Analyzes medical images to detect anomalies and potential health issues.
 *
 * - analyzeMedicalImage - Analyzes a medical image and returns a risk assessment.
 * - MedicalImageAnalysisInput - The input type for the analyzeMedicalImage function.
 * - MedicalImageAnalysisOutput - The return type for the analyzeMedicalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalImageAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A medical image (X-ray, MRI, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('Additional description or context about the image.'),
});
export type MedicalImageAnalysisInput = z.infer<typeof MedicalImageAnalysisInputSchema>;

const MedicalImageAnalysisOutputSchema = z.object({
  anomaliesDetected: z.boolean().describe('Whether any anomalies were detected in the image.'),
  riskAssessment: z
    .string()
    .describe(
      'A risk assessment based on the detected anomalies, indicating the severity and potential health risks.'
    ),
  recommendation: z
    .string()
    .describe(
      'A recommendation for further action, such as review by a specialist or additional tests.'
    ),
  confidenceLevel: z
    .number()
    .describe(
      'A confidence level (0-1) indicating the AI’s certainty in the analysis and risk assessment.'
    ),
});
export type MedicalImageAnalysisOutput = z.infer<typeof MedicalImageAnalysisOutputSchema>;

export async function analyzeMedicalImage(
  input: MedicalImageAnalysisInput
): Promise<MedicalImageAnalysisOutput> {
  return analyzeMedicalImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalImageAnalysisPrompt',
  input: {schema: MedicalImageAnalysisInputSchema},
  output: {schema: MedicalImageAnalysisOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing medical images to detect anomalies and potential health issues.

  Analyze the provided medical image and provide a risk assessment and recommendation based on your findings.

  Description: {{{description}}}
  Image: {{media url=photoDataUri}}

  Based on your analysis, set the anomaliesDetected field to true if any anomalies are found, and provide a detailed riskAssessment and recommendation.

  The output should be formatted as a JSON object conforming to the MedicalImageAnalysisOutputSchema. The Zod schema descriptions are as follows:
  ${JSON.stringify(
    MedicalImageAnalysisOutputSchema.describe(),
    null,
    2
  )}`,
});

const analyzeMedicalImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalImageFlow',
    inputSchema: MedicalImageAnalysisInputSchema,
    outputSchema: MedicalImageAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
