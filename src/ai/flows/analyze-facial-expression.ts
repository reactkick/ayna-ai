'use server';

/**
 * @fileOverview An AI agent that analyzes facial expressions from an image.
 *
 * - analyzeFacialExpression - A function that handles the facial expression analysis process.
 * - AnalyzeFacialExpressionInput - The input type for the analyzeFacialExpression function.
 * - AnalyzeFacialExpressionOutput - The return type for the analyzeFacialExpression function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFacialExpressionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFacialExpressionInput = z.infer<typeof AnalyzeFacialExpressionInputSchema>;

const AnalyzeFacialExpressionOutputSchema = z.object({
  dominantEmotion: z
    .string()
    .describe('The dominant emotion detected in the face (e.g., happy, sad, angry, neutral).'),
});
export type AnalyzeFacialExpressionOutput = z.infer<typeof AnalyzeFacialExpressionOutputSchema>;

export async function analyzeFacialExpression(input: AnalyzeFacialExpressionInput): Promise<AnalyzeFacialExpressionOutput> {
  return analyzeFacialExpressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacialExpressionPrompt',
  input: {schema: AnalyzeFacialExpressionInputSchema},
  output: {schema: AnalyzeFacialExpressionOutputSchema},
  prompt: `You are an AI that analyzes facial expressions from images and determines the dominant emotion.

  Analyze the provided image of a face and identify the most prominent emotion displayed.
  The possible emotions are happy, sad, angry, surprised, neutral, fear, disgust.

  Return only the dominant emotion.

  Image: {{media url=photoDataUri}}`,
});

const analyzeFacialExpressionFlow = ai.defineFlow(
  {
    name: 'analyzeFacialExpressionFlow',
    inputSchema: AnalyzeFacialExpressionInputSchema,
    outputSchema: AnalyzeFacialExpressionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
