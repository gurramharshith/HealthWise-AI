
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {firebase} from "@genkit-ai/firebase";
import {next} from "@genkit-ai/next";

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: 'v1beta'
    }),
    next(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
