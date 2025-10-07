
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a chat conversation.
 *
 * The flow takes a chat history and uses a language model to create a concise summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatSummarizerInputSchema = z.object({
  history: z.array(MessageSchema).describe('The chat conversation history.'),
});
export type ChatSummarizerInput = z.infer<typeof ChatSummarizerInputSchema>;

const ChatSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the chat conversation.'),
});
export type ChatSummarizerOutput = z.infer<typeof ChatSummarizerOutputSchema>;

export async function summarizeChat(
  input: ChatSummarizerInput
): Promise<ChatSummarizerOutput> {
  return summarizeChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: { schema: ChatSummarizerInputSchema },
  output: { schema: ChatSummarizerOutputSchema },
  prompt: `You are an AI assistant specialized in summarizing conversations.
  
  Analyze the following chat transcript and provide a concise summary of the key points.
  
  Chat History:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  Your summary should capture the main questions asked by the user and the key information provided by the model.
  Structure your response as a JSON object conforming to the ChatSummarizerOutputSchema.
  `,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: ChatSummarizerInputSchema,
    outputSchema: ChatSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    