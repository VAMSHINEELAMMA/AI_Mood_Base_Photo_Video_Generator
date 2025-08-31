import { config } from 'dotenv';
config();

import '@/ai/flows/ai-scene-generation.ts';
import '@/ai/flows/pose-guidance.ts';
import '@/ai/flows/mood-based-suggestions.ts';