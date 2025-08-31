"use client";

import type { MoodBasedSuggestionsOutput } from "@/ai/flows/mood-based-suggestions";
import type { PoseGuidanceOutput } from "@/ai/flows/pose-guidance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  Sparkles,
  Camera,
  PersonStanding,
  Mountain,
} from "lucide-react";

type SuggestionsDisplayProps = {
  suggestions: MoodBasedSuggestionsOutput | null;
  poseGuidance: PoseGuidanceOutput | null;
  isLoading: boolean;
};

const SuggestionItem = ({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ElementType;
  title: string;
  content: string | undefined;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
    <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-bold text-lg font-headline">{title}</h4>
      <p className="text-muted-foreground">{content}</p>
    </div>
  </div>
);

export function SuggestionsDisplay({
  suggestions,
  poseGuidance,
  isLoading,
}: SuggestionsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl tracking-wide">
            AI Suggestions
          </CardTitle>
          <CardDescription>
            Getting creative recommendations...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || !poseGuidance) {
    return null;
  }

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wide">
          2. AI Suggestions
        </CardTitle>
        <CardDescription>
          Recommendations based on your chosen mood.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Creative</TabsTrigger>
            <TabsTrigger value="poses">Poses</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions" className="mt-4 space-y-4">
            <SuggestionItem
              icon={Mountain}
              title="Background"
              content={suggestions.backgroundSuggestion}
            />
            <SuggestionItem
              icon={Lightbulb}
              title="Lighting"
              content={suggestions.lightingSuggestion}
            />
            <SuggestionItem
              icon={Sparkles}
              title="Filter"
              content={suggestions.filterSuggestion}
            />
          </TabsContent>
          <TabsContent value="poses" className="mt-4">
            <div className="flex flex-col gap-4">
              {poseGuidance.poseSuggestions.map((pose, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <PersonStanding className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{pose}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
