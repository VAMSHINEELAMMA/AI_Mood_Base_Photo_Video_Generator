"use client";

import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Heart,
  Smile,
  Theater,
  Zap,
  BrainCircuit,
  Loader2,
} from "lucide-react";

const moods = [
  { name: "Happy", icon: Smile },
  { name: "Dramatic", icon: Theater },
  { name: "Romantic", icon: Heart },
  { name: "Energetic", icon: Zap },
  { name: "Mysterious", icon: BrainCircuit },
];

type MoodSelectorProps = {
  onSelect: (mood: string) => void;
  selectedMood: string | null;
  isLoading: boolean;
};

export function MoodSelector({
  onSelect,
  selectedMood,
  isLoading,
}: MoodSelectorProps) {
  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wide">
          1. Choose Your Mood
        </CardTitle>
        <CardDescription>
          Select an emotional tone to get AI-powered suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood.name}
            variant={selectedMood === mood.name ? "default" : "outline"}
            className={cn(
              "flex flex-col h-24 text-lg p-4 transition-all duration-200 transform hover:scale-105",
              selectedMood === mood.name &&
                "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            onClick={() => onSelect(mood.name)}
            disabled={isLoading}
          >
            <mood.icon className="w-8 h-8 mb-2" />
            <span className="font-headline tracking-wider">{mood.name}</span>
          </Button>
        ))}
        {isLoading && selectedMood && (
          <div className="col-span-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Loading suggestions for {selectedMood}...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
