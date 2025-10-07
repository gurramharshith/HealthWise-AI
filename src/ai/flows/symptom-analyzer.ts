
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user-described symptoms.
 *
 * The flow takes a string of symptoms and uses a language model to provide a preliminary analysis,
 * including potential conditions and recommendations for next steps.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  symptoms: z
    .string()
    .min(10, 'Please describe your symptoms in at least 10 characters.')
    .describe('A description of the user\'s symptoms.'),
});
export type SymptomAnalysisInput = z.infer<
  typeof SymptomAnalysisInputSchema
>;

const SymptomAnalysisOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe(
      'A summary of potential health conditions that could be associated with the described symptoms.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for next steps, such as consulting a specialist, seeking immediate medical attention, or performing certain tests.'
    ),
  disclaimer: z
    .string()
    .describe('A mandatory disclaimer that this is not a medical diagnosis.'),
});
export type SymptomAnalysisOutput = z.infer<
  typeof SymptomAnalysisOutputSchema
>;

export async function analyzeSymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalysisInputSchema},
  output: {schema: SymptomAnalysisOutputSchema},
  prompt: `You are an AI healthcare assistant designed to provide a preliminary analysis of symptoms.
  
  Analyze the following user-described symptoms:
  "{{{symptoms}}}"

  Based on these symptoms, provide a list of potential health conditions and clear, actionable recommendations.

  IMPORTANT: Your response MUST include a disclaimer stating that you are an AI, not a medical professional, and that the user should consult a qualified doctor for any medical advice or diagnosis.

  Structure your response as a JSON object conforming to the SymptomAnalysisOutputSchema.
  `,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
