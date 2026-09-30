"use client";

import { useEffect, useState } from "react";

const TICK_MS = 30_000;

export interface Runtime {
  readonly tz: string;
  readonly origin: string;
  // `null` until the component has mounted on the client. Server render and the
  // first client render therefore agree (both null), which avoids the hydration
  // mismatch you get from seeding state with `new Date()`.
  readonly now: Date | null;
}

export function useRuntime(): Runtime {
  const [tz, setTz] = useState("UTC");
  const [origin, setOrigin] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    } catch {
      /* keep UTC */
    }
    setOrigin(window.location.origin);
    setNow(new Date());

    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return { tz, origin, now };
}
