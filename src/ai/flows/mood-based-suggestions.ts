'use server';

/**
 * @fileOverview AI-powered suggestions for poses, backgrounds, lighting, and filters based on the selected mood.
 *
 * - getMoodBasedSuggestions - A function that retrieves suggestions based on the selected mood.
 * - MoodBasedSuggestionsInput - The input type for the getMoodBasedSuggestions function.
 * - MoodBasedSuggestionsOutput - The return type for the getMoodBasedSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodBasedSuggestionsInputSchema = z.object({
  mood: z
    .string()
    .describe('The selected mood (e.g., happy, dramatic, romantic).'),
});
export type MoodBasedSuggestionsInput = z.infer<typeof MoodBasedSuggestionsInputSchema>;

const MoodBasedSuggestionsOutputSchema = z.object({
  poseSuggestion: z.string().describe('Suggested pose based on the mood.'),
  backgroundSuggestion: z.string().describe('Suggested background based on the mood.'),
  lightingSuggestion: z.string().describe('Suggested lighting based on the mood.'),
  filterSuggestion: z.string().describe('Suggested filter based on the mood.'),
});
export type MoodBasedSuggestionsOutput = z.infer<typeof MoodBasedSuggestionsOutputSchema>;

export async function getMoodBasedSuggestions(input: MoodBasedSuggestionsInput): Promise<MoodBasedSuggestionsOutput> {
  return moodBasedSuggestionsFlow(input);
}

const moodBasedSuggestionsPrompt = ai.definePrompt({
  name: 'moodBasedSuggestionsPrompt',
  input: {schema: MoodBasedSuggestionsInputSchema},
  output: {schema: MoodBasedSuggestionsOutputSchema},
  prompt: `You are a creative assistant providing suggestions for creating visually appealing content based on a selected mood.

  Based on the mood: {{{mood}}}, provide suggestions for the following aspects:

  - pose: Suggest a pose that reflects the selected mood.
  - background: Suggest a background that complements the mood.
  - lighting: Suggest lighting conditions that enhance the mood.
  - filter: Suggest a filter that aligns with the mood.

  Provide concise and practical suggestions that users can easily implement.
  `,
});

const moodBasedSuggestionsFlow = ai.defineFlow(
  {
    name: 'moodBasedSuggestionsFlow',
    inputSchema: MoodBasedSuggestionsInputSchema,
    outputSchema: MoodBasedSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await moodBasedSuggestionsPrompt(input);
    return output!;
  }
);
