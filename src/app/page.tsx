"use client";

import { useState } from "react";
import type { MoodBasedSuggestionsOutput } from "@/ai/flows/mood-based-suggestions";
import type { PoseGuidanceOutput } from "@/ai/flows/pose-guidance";
import { fetchSuggestions, fetchPoseGuidance, createScene } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "@/components/mood-selector";
import { SuggestionsDisplay } from "@/components/suggestions-display";
import { SceneGenerator } from "@/components/scene-generator";
import { CameraView } from "@/components/camera-view";
import { Wand2 } from "lucide-react";

export default function Home() {
  const [mood, setMood] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<MoodBasedSuggestionsOutput | null>(null);
  const [poseGuidance, setPoseGuidance] = useState<PoseGuidanceOutput | null>(
    null
  );
  const [generatedScene, setGeneratedScene] = useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingScene, setIsLoadingScene] = useState(false);
  const [activeFilter, setActiveFilter] = useState("none");
  const { toast } = useToast();

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    setSuggestions(null);
    setPoseGuidance(null);
    setGeneratedScene(null);
    setIsLoadingSuggestions(true);

    try {
      const [suggestionsResult, poseGuidanceResult] = await Promise.all([
        fetchSuggestions({ mood: selectedMood }),
        fetchPoseGuidance({ mood: selectedMood }),
      ]);
      setSuggestions(suggestionsResult);
      setPoseGuidance(poseGuidanceResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch AI suggestions. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleGenerateScene = async (
    sceneDescription: string,
    type: "image" | "video"
  ) => {
    if (!mood) {
      toast({
        title: "Error",
        description: "Please select a mood first.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingScene(true);
    setGeneratedScene(null);
    try {
      const result = await createScene({ mood, sceneDescription, type });
      setGeneratedScene(result.sceneDataUri);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI scene. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoadingScene(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-body text-foreground">
      <header className="flex items-center justify-center p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Wand2 className="w-8 h-8 text-primary" />
        <h1 className="ml-3 text-4xl font-headline tracking-wider">
          VisuMood AI
        </h1>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-8 p-4 sm:p-8">
        <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-8">
          <MoodSelector
            onSelect={handleMoodSelect}
            selectedMood={mood}
            isLoading={isLoadingSuggestions}
          />
          <SuggestionsDisplay
            suggestions={suggestions}
            poseGuidance={poseGuidance}
            isLoading={isLoadingSuggestions}
          />
          <SceneGenerator
            mood={mood}
            onGenerate={handleGenerateScene}
            isLoading={isLoadingScene}
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <CameraView
            scene={generatedScene}
            filter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </main>
    </div>
  );
}
