'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of user text input.
 *
 * - analyzeUserSentiment - A function that analyzes the sentiment of the text input.
 * - AnalyzeUserSentimentInput - The input type for the analyzeUserSentiment function.
 * - AnalyzeUserSentimentOutput - The return type for the analyzeUserSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserSentimentInputSchema = z.object({
  text: z.string().describe('The text input from the user.'),
});
export type AnalyzeUserSentimentInput = z.infer<typeof AnalyzeUserSentimentInputSchema>;

const AnalyzeUserSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the text input (positive, negative, or neutral)'
    ),
});
export type AnalyzeUserSentimentOutput = z.infer<typeof AnalyzeUserSentimentOutputSchema>;

export async function analyzeUserSentiment(input: AnalyzeUserSentimentInput): Promise<AnalyzeUserSentimentOutput> {
  return analyzeUserSentimentFlow(input);
}

const analyzeUserSentimentPrompt = ai.definePrompt({
  name: 'analyzeUserSentimentPrompt',
  input: {schema: AnalyzeUserSentimentInputSchema},
  output: {schema: AnalyzeUserSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following text. Return "positive", "negative", or "neutral".

Text: {{{text}}}`,
});

const analyzeUserSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeUserSentimentFlow',
    inputSchema: AnalyzeUserSentimentInputSchema,
    outputSchema: AnalyzeUserSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserSentimentPrompt(input);
    return output!;
  }
);
