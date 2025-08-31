"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Camera,
  Share2,
  Twitter,
  Instagram,
  Facebook,
  Loader2,
} from "lucide-react";

type CameraViewProps = {
  scene: string | null;
  filter: string;
  onFilterChange: (filter: string) => void;
};

const filters = [
  { name: "None", class: "filter-none" },
  { name: "Vintage", class: "sepia-[.6] contrast-125 brightness-90" },
  { name: "Noir", class: "grayscale" },
  { name: "Vibrant", class: "saturate-150 contrast-110" },
  { name: "Dreamy", class: "blur-[2px] opacity-80" },
];

export function CameraView({
  scene,
  filter,
  onFilterChange,
}: CameraViewProps) {
  const isVideo = scene?.startsWith("data:video");

  return (
    <Card className="shadow-2xl sticky top-28 transition-all duration-300 hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-3xl tracking-wide text-center">
          Your Canvas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden bg-muted relative border-4 border-secondary shadow-inner">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground z-0">
            {scene ? (
              isLoading ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4">Loading Scene...</p>
                </div>
              ) : null
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto" />
                <p className="mt-2">Select a mood to begin</p>
              </div>
            )}
          </div>
          {scene && isVideo ? (
             <video
              src={scene}
              className={cn("w-full h-full object-cover z-10 relative", filter)}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              src={scene || "https://picsum.photos/1280/720"}
              alt="Camera View"
              width={1280}
              height={720}
              data-ai-hint="portrait fashion"
              className={cn(
                "w-full h-full object-cover transition-all duration-500 z-10 relative",
                filter,
                scene ? "opacity-100" : "opacity-30"
              )}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-6">
        <div>
          <h3 className="text-center mb-4 font-headline text-xl">Apply a Filter</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <Button
                key={f.name}
                variant={filter === f.class ? "default" : "outline"}
                onClick={() => onFilterChange(f.class)}
              >
                {f.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
            <Button size="lg" className="w-full max-w-xs text-xl py-8 font-headline tracking-wider transform hover:scale-105 transition-transform duration-200">
                <Camera className="mr-3 h-8 w-8" /> Capture
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Share2 className="w-5 h-5" />
                <p>Share your creation:</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Twitter /></Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Instagram /></Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Facebook /></Button>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
