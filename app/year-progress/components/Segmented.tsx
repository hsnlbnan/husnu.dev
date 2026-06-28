"use client";

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
  return (
    <LayoutGroup id={group}>
      <div className="seg" role="radiogroup" aria-label={group}>
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
