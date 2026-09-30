"use client";

import { useCallback, useReducer } from "react";
import type { Hex } from "../lib/hex";
import { createInitialConfig, type WallpaperConfig } from "../lib/config";

// A correlated action type: for every field K, `key`/`value` are pinned to the
// same property. This makes `set("cols", "oops")` a compile error.
type SetAction = {
  [K in keyof WallpaperConfig]: { type: "set"; key: K; value: WallpaperConfig[K] };
}[keyof WallpaperConfig];

type ConfigAction = SetAction | { type: "theme"; fg: Hex; bg: Hex };

function assertNever(action: never): never {
  throw new Error(`Unhandled config action: ${JSON.stringify(action)}`);
}

function reducer(state: WallpaperConfig, action: ConfigAction): WallpaperConfig {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "theme":
      return { ...state, fg: action.fg, bg: action.bg };
    default:
      return assertNever(action);
  }
}

export interface WallpaperConfigController {
  readonly config: WallpaperConfig;
  readonly set: <K extends keyof WallpaperConfig>(key: K, value: WallpaperConfig[K]) => void;
  readonly applyTheme: (fg: Hex, bg: Hex) => void;
}

export function useWallpaperConfig(): WallpaperConfigController {
  const [config, dispatch] = useReducer(reducer, undefined, createInitialConfig);

  const set = useCallback(
    <K extends keyof WallpaperConfig>(key: K, value: WallpaperConfig[K]) =>
      dispatch({ type: "set", key, value } as ConfigAction),
    []
  );

  const applyTheme = useCallback((fg: Hex, bg: Hex) => dispatch({ type: "theme", fg, bg }), []);

  return { config, set, applyTheme };
}
