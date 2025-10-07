
'use server';

/**
 * @fileOverview A health chat assistant AI flow.
 *
 * - healthChat - A function that handles the chat conversation.
 * - HealthChatInput - The input type for the healthChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const HealthChatInputSchema = z.object({
  history: z.array(MessageSchema),
});
export type HealthChatInput = z.infer<typeof HealthChatInputSchema>;

export async function healthChat(input: HealthChatInput): Promise<string> {
  const llmResponse = await healthChatFlow(input);
  return llmResponse;
}

const prompt = ai.definePrompt(
  {
    name: 'healthChatPrompt',
    input: { schema: HealthChatInputSchema },
    prompt: `You are a friendly and helpful AI health assistant for HealthWise AI. Your role is to provide general health information and answer user questions.

  IMPORTANT: You must always include a disclaimer that you are not a medical professional and the user should consult with a doctor for any medical advice. Do not provide diagnoses or prescribe treatments.

  Here is the conversation history:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}
  model:`,
  },
);

const healthChatFlow = ai.defineFlow(
  {
    name: 'healthChatFlow',
    inputSchema: HealthChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
