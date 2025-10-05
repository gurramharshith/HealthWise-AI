'use server';

/**
 * @fileOverview Provides early diagnosis and risk assessments based on analyzed data.
 *
 * - earlyDiagnosisAndRiskAssessment - A function that handles the early diagnosis and risk assessment process.
 * - EarlyDiagnosisAndRiskAssessmentInput - The input type for the earlyDiagnosisAndRiskAssessment function.
 * - EarlyDiagnosisAndRiskAssessmentOutput - The return type for the earlyDiagnosisAndRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EarlyDiagnosisAndRiskAssessmentInputSchema = z.object({
  medicalImageDataUri: z
    .string()
    .describe(
      "A medical image (X-ray, MRI) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  ehrData: z.string().describe('The Electronic Health Records data.'),
  patientMonitoringData: z
    .string()
    .describe('Data from wearable devices and patient monitoring systems.'),
});
export type EarlyDiagnosisAndRiskAssessmentInput = z.infer<
  typeof EarlyDiagnosisAndRiskAssessmentInputSchema
>;

const EarlyDiagnosisAndRiskAssessmentOutputSchema = z.object({
  diagnosis: z.string().describe('The early diagnosis based on the data.'),
  riskAssessment: z
    .string()
    .describe('The risk assessment based on the analyzed data.'),
  recommendations: z
    .string()
    .describe('Recommendations for further evaluation or treatment.'),
  warrantsReview: z.boolean().describe('Whether or not the image warrants review by a professional.'),
});
export type EarlyDiagnosisAndRiskAssessmentOutput = z.infer<
  typeof EarlyDiagnosisAndRiskAssessmentOutputSchema
>;

export async function earlyDiagnosisAndRiskAssessment(
  input: EarlyDiagnosisAndRiskAssessmentInput
): Promise<EarlyDiagnosisAndRiskAssessmentOutput> {
  return earlyDiagnosisAndRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'earlyDiagnosisAndRiskAssessmentPrompt',
  input: {schema: EarlyDiagnosisAndRiskAssessmentInputSchema},
  output: {schema: EarlyDiagnosisAndRiskAssessmentOutputSchema},
  prompt: `You are an AI-powered healthcare diagnostic system. Analyze the provided medical data to provide an early diagnosis, risk assessment, and recommendations.

Medical Image: {{media url=medicalImageDataUri}}
EHR Data: {{{ehrData}}}
Patient Monitoring Data: {{{patientMonitoringData}}}

Based on this information, provide an early diagnosis, a risk assessment, and recommendations for further evaluation or treatment.  You should respond in a structured format.

In addition, respond true or false as to whether the image warrants a review by a professional.  This is an important safety check, so if in doubt, default to true.

Diagnosis:
Risk Assessment:
Recommendations:
Warrants Review: true/false
`,
});

const earlyDiagnosisAndRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'earlyDiagnosisAndRiskAssessmentFlow',
    inputSchema: EarlyDiagnosisAndRiskAssessmentInputSchema,
    outputSchema: EarlyDiagnosisAndRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
