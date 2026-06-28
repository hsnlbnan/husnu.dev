import { hex, type Hex } from "./hex";

export interface ThemePreset {
  readonly fg: Hex;
  readonly bg: Hex;
}

export const THEMES: readonly ThemePreset[] = [
  { fg: hex("#ffffff"), bg: hex("#0a0a0a") },
  { fg: hex("#0a0a0a"), bg: hex("#f4f4f5") },
  { fg: hex("#34d399"), bg: hex("#0b1410") },
  { fg: hex("#f59e0b"), bg: hex("#161009") },
  { fg: hex("#60a5fa"), bg: hex("#0a0f1a") },
  { fg: hex("#f472b6"), bg: hex("#170a12") },
];
