
'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting potential health conditions based on patient data.
 *
 * The flow takes patient data as input and uses a language model to assess the likelihood of various health conditions.
 * It exports the `predictConditionAssessment` function, the `PredictConditionAssessmentInput` type, and the `PredictConditionAssessmentOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictConditionAssessmentInputSchema = z.object({
  patientHistory: z
    .string()
    .describe('The complete medical history of the patient.'),
  labResults: z
    .string()
    .describe('The results from recent laboratory tests.'),
  monitoringData: z
    .string()
    .describe(
      'Data collected from patient monitoring systems, such as wearable devices.'
    ),
});
export type PredictConditionAssessmentInput = z.infer<
  typeof PredictConditionAssessmentInputSchema
>;

const PredictConditionAssessmentOutputSchema = z.object({
  conditionPredictions: z
    .string()
    .describe(
      'A summary of potential health conditions and their likelihood based on the input data.'
    ),
  riskAssessment: z
    .string()
    .describe(
      'An overall risk assessment based on the predicted conditions.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for further evaluation or preventative measures.'
    ),
});
export type PredictConditionAssessmentOutput = z.infer<
  typeof PredictConditionAssessmentOutputSchema
>;

export async function predictConditionAssessment(
  input: PredictConditionAssessmentInput
): Promise<PredictConditionAssessmentOutput> {
  return predictConditionAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictConditionAssessmentPrompt',
  input: {schema: PredictConditionAssessmentInputSchema},
  output: {schema: PredictConditionAssessmentOutputSchema},
  prompt: `You are an AI healthcare assistant. Analyze the patient data and predict potential health conditions.

  Patient History: {{{patientHistory}}}
  Lab Results: {{{labResults}}}
  Monitoring Data: {{{monitoringData}}}

  Based on this information, provide a condition prediction, risk assessment, and recommendations. Return results in JSON format.
  Ensure your output is well-formatted and easy to understand.
  The conditionPredictions field should describe potential conditions and their likelihood.
  The riskAssessment field should provide an overall risk assessment based on the predicted conditions.
  The recommendations field should provide specific next steps.
  
  Follow this JSON schema:
  {
    "conditionPredictions": string,
    "riskAssessment": string,
    "recommendations": string
  }`,
});

const predictConditionAssessmentFlow = ai.defineFlow(
  {
    name: 'predictConditionAssessmentFlow',
    inputSchema: PredictConditionAssessmentInputSchema,
    outputSchema: PredictConditionAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
