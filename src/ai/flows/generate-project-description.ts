'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating project descriptions using a prompt.
 *
 * The flow takes project details as input and returns a generated project description.
 * @fileOverview A project description AI generator agent.
 *
 * - generateProjectDescription - A function that handles the project description process.
 * - GenerateProjectDescriptionInput - The input type for the generateProjectDescription function.
 * - GenerateProjectDescriptionOutput - The return type for the generateProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectCategory: z.string().describe('The category of the project.'),
  projectTechnologies: z.string().describe('The technologies used in the project.'),
  projectDescriptionPrompt: z.string().describe('A detailed prompt describing the project and desired description style.'),
});
export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  generatedDescription: z.string().describe('The generated project description.'),
});
export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(
  input: GenerateProjectDescriptionInput
): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling project descriptions.

  Based on the following project details and description prompt, generate an engaging project description.

  Project Title: {{{projectTitle}}}
  Project Category: {{{projectCategory}}}
  Project Technologies: {{{projectTechnologies}}}
  Description Prompt: {{{projectDescriptionPrompt}}}
  \n  Write a project description that will entice potential buyers to learn more. Focus on benefits rather than features.
  `,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
