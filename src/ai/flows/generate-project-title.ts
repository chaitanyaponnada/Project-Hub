'use server';

/**
 * @fileOverview AI agent that generate project titles based on project details.
 *
 * - generateProjectTitle - A function that generates a project title.
 * - GenerateProjectTitleInput - The input type for the generateProjectTitle function.
 * - GenerateProjectTitleOutput - The return type for the generateProjectTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectTitleInputSchema = z.object({
  projectDetails: z
    .string()
    .describe('Detailed description of the project for which to generate a title.'),
});
export type GenerateProjectTitleInput = z.infer<typeof GenerateProjectTitleInputSchema>;

const GenerateProjectTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the project.'),
});
export type GenerateProjectTitleOutput = z.infer<typeof GenerateProjectTitleOutputSchema>;

export async function generateProjectTitle(input: GenerateProjectTitleInput): Promise<GenerateProjectTitleOutput> {
  return generateProjectTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectTitlePrompt',
  input: {schema: GenerateProjectTitleInputSchema},
  output: {schema: GenerateProjectTitleOutputSchema},
  prompt: `You are an expert in creating catchy and informative project titles. Based on the following project details, generate a title that is both engaging and accurately reflects the project's content:\n\nProject Details: {{{projectDetails}}}`,
});

const generateProjectTitleFlow = ai.defineFlow(
  {
    name: 'generateProjectTitleFlow',
    inputSchema: GenerateProjectTitleInputSchema,
    outputSchema: GenerateProjectTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
