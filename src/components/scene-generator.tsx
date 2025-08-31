"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

type SceneGeneratorProps = {
  mood: string | null;
  onGenerate: (description: string, type: "image" | "video") => void;
  isLoading: boolean;
};

export function SceneGenerator({
  mood,
  onGenerate,
  isLoading,
}: SceneGeneratorProps) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"image" | "video">("image");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(description, type);
  };

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wide">
          3. AI Scene Generation
        </CardTitle>
        <CardDescription>
          Create a unique backdrop for your content. This may take a moment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scene-description">Scene Description (Optional)</Label>
            <Input
              id="scene-description"
              placeholder="e.g., a serene beach at sunset"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!mood || isLoading}
            />
          </div>

          <RadioGroup
            defaultValue="image"
            value={type}
            onValueChange={(value: "image" | "video") => setType(value)}
            className="flex space-x-4"
            disabled={!mood || isLoading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image">Image</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video" />
              <Label htmlFor="video">Video</Label>
            </div>
          </RadioGroup>

          <Button type="submit" className="w-full" disabled={!mood || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Scene"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
