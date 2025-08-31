"use server";

import {
  getMoodBasedSuggestions,
  type MoodBasedSuggestionsInput,
  type MoodBasedSuggestionsOutput,
} from "@/ai/flows/mood-based-suggestions";
import {
  getPoseGuidance,
  type PoseGuidanceInput,
  type PoseGuidanceOutput,
} from "@/ai/flows/pose-guidance";
import {
  generateAIScene,
  type GenerateAISceneInput,
  type GenerateAISceneOutput,
} from "@/ai/flows/ai-scene-generation";

export async function fetchSuggestions(
  input: MoodBasedSuggestionsInput
): Promise<MoodBasedSuggestionsOutput> {
  try {
    const suggestions = await getMoodBasedSuggestions(input);
    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to fetch suggestions.");
  }
}

export async function fetchPoseGuidance(
  input: PoseGuidanceInput
): Promise<PoseGuidanceOutput> {
  try {
    const guidance = await getPoseGuidance(input);
    return guidance;
  } catch (error) {
    console.error("Error fetching pose guidance:", error);
    throw new Error("Failed to fetch pose guidance.");
  }
}

export async function createScene(
  input: GenerateAISceneInput
): Promise<GenerateAISceneOutput> {
  try {
    const scene = await generateAIScene(input);
    return scene;
  } catch (error) {
    console.error("Error creating scene:", error);
    throw new Error("Failed to create scene.");
  }
}
