import type { Theme } from './types';
import { classicThemes } from './classic';
import { modernThemes } from './modern';

export type { Theme };
export const THEMES: Theme[] = [...classicThemes, ...modernThemes];
