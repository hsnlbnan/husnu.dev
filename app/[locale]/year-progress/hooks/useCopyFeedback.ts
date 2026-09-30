"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Copies text to the clipboard and exposes a transient "copied" flag. */
export function useCopyFeedback(resetMs = 1600): readonly [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending timer on unmount so we never setState on a dead component.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), resetMs);
        })
        .catch(() => {
          /* clipboard unavailable — leave state untouched */
        });
    },
    [resetMs]
  );

  return [copied, copy] as const;
}
