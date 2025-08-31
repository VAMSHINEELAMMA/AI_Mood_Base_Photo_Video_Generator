'use server';

/**
 * @fileOverview An AI scene generation agent for creating backdrops based on a chosen mood.
 *
 * - generateAIScene - A function that handles the AI scene generation process.
 * - GenerateAISceneInput - The input type for the generateAIScene function.
 * - GenerateAISceneOutput - The return type for the generateAIScene function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAISceneInputSchema = z.object({
  mood: z.string().describe('The mood for which to generate the scene (e.g., happy, dramatic, romantic).'),
  sceneDescription: z.string().optional().describe('Optional: A description of the scene to generate.'),
  type: z.enum(['image', 'video']).default('image').describe('The type of scene to generate (image or video).'),
});
export type GenerateAISceneInput = z.infer<typeof GenerateAISceneInputSchema>;

const GenerateAISceneOutputSchema = z.object({
  sceneDataUri: z.string().describe('The data URI of the generated scene (image or video).'),
});
export type GenerateAISceneOutput = z.infer<typeof GenerateAISceneOutputSchema>;

export async function generateAIScene(input: GenerateAISceneInput): Promise<GenerateAISceneOutput> {
  return generateAISceneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAIScenePrompt',
  input: {schema: GenerateAISceneInputSchema},
  output: {schema: GenerateAISceneOutputSchema},
  prompt: `You are an AI scene generator. You will generate either an image or a video scene based on the user's chosen mood.

Mood: {{{mood}}}
Scene Description: {{{sceneDescription}}}
Type: {{{type}}}

Generate a scene suitable for use as a backdrop, reflecting the specified mood. If the type is video, make it a short, looping video.

Ensure the output is a data URI.`, // make sure to return a data URI
});

const generateAISceneFlow = ai.defineFlow(
  {
    name: 'generateAISceneFlow',
    inputSchema: GenerateAISceneInputSchema,
    outputSchema: GenerateAISceneOutputSchema,
  },
  async input => {
    if (input.type === 'image') {
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate an image with the following mood: ${input.mood}. ${input.sceneDescription ? `Also, include these details: ${input.sceneDescription}` : ''}`,
      });
      return {sceneDataUri: media.url!};
    } else {
      // Video generation
      let {operation} = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: `Generate a video with the following mood: ${input.mood}. ${input.sceneDescription ? `Also, include these details: ${input.sceneDescription}` : ''}`,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }

      // Wait until the operation completes.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        // Sleep for 5 seconds before checking again.
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
      }

      const video = operation.output?.message?.content.find(p => !!p.media);
      if (!video) {
        throw new Error('Failed to find the generated video');
      }

      //console.log(video.media!.url)
      return {sceneDataUri: video.media!.url!};
    }
  }
);
