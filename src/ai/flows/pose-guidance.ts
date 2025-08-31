'use server';

/**
 * @fileOverview Provides AI-driven pose guidance based on the selected mood.
 *
 * - getPoseGuidance - A function that returns pose suggestions based on the selected mood.
 * - PoseGuidanceInput - The input type for the getPoseGuidance function.
 * - PoseGuidanceOutput - The return type for the getPoseGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PoseGuidanceInputSchema = z.object({
  mood: z
    .string()
    .describe('The selected mood (e.g., happy, dramatic, romantic).'),
});
export type PoseGuidanceInput = z.infer<typeof PoseGuidanceInputSchema>;

const PoseGuidanceOutputSchema = z.object({
  poseSuggestions: z
    .array(z.string())
    .describe('Array of pose suggestions based on the selected mood.'),
});
export type PoseGuidanceOutput = z.infer<typeof PoseGuidanceOutputSchema>;

export async function getPoseGuidance(input: PoseGuidanceInput): Promise<PoseGuidanceOutput> {
  return poseGuidanceFlow(input);
}

const poseGuidancePrompt = ai.definePrompt({
  name: 'poseGuidancePrompt',
  input: {schema: PoseGuidanceInputSchema},
  output: {schema: PoseGuidanceOutputSchema},
  prompt: `You are an AI pose suggestion assistant.  Given the selected mood, suggest several poses that would be appropriate.

Mood: {{{mood}}}

Provide the pose suggestions as a list of strings.
`,
});

const poseGuidanceFlow = ai.defineFlow(
  {
    name: 'poseGuidanceFlow',
    inputSchema: PoseGuidanceInputSchema,
    outputSchema: PoseGuidanceOutputSchema,
  },
  async input => {
    const {output} = await poseGuidancePrompt(input);
    return output!;
  }
);
