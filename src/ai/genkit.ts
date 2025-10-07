import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

// Initialize Firebase telemetry
enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta'
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
