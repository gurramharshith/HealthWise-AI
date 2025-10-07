import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {firebase} from "@genkit-ai/firebase";
import {next} from "@genkit-ai/next";

configureGenkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: 'v1beta'
    }),
    next({
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit();
