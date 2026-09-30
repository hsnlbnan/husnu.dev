"use client";

import { useEffect, useRef } from "react";
import { LayoutGroup, motion } from "framer-motion";

export interface SegmentedOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface SegmentedProps<T extends string> {
  group: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  reduce: boolean;
}

export default function Segmented<T extends string>({
  group,
  value,
  onChange,
  options,
  reduce,
}: SegmentedProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  // When the row is horizontally scrollable (e.g. the 4-option control on
  // phones), keep the selected option centred so its neighbours stay reachable.
  // Scoped to this container's scrollLeft so it never nudges the page.
  useEffect(() => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const active = el.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const target = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  }, [value, reduce]);

  return (
    <LayoutGroup id={group}>
      <div className="seg" role="radiogroup" aria-label={group} ref={ref}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              className="seg-btn"
              data-active={active}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              type="button"
            >
              {active && (
                <motion.span
                  layoutId="seg-ind"
                  className="seg-ind"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.5, bounce: 0.2 }
                  }
                />
              )}
              <span className="seg-label">{o.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
