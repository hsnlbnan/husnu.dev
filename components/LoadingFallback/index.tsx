import React from "react";

type LoadingFallbackVariant =
  | "default"
  | "bento"
  | "terminal"
  | "focus"
  | "profile";

interface LoadingFallbackProps {
  height?: string;
  width?: string;
  className?: string;
  variant?: LoadingFallbackVariant;
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded-lg bg-white/7 ${className}`} />;
}

function BentoSkeleton() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-10 w-72 max-w-full" />
        </div>
        <div className="hidden gap-3 md:flex">
          <SkeletonBlock className="h-12 w-12 rounded-xl" />
          <SkeletonBlock className="h-12 w-12 rounded-xl" />
          <SkeletonBlock className="h-12 w-12 rounded-xl" />
        </div>
      </div>

      <SkeletonBlock className="h-px w-full rounded-full" />

      <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-2 w-2 rounded-full" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-7 w-20" />
              <SkeletonBlock className="h-7 w-16" />
              <SkeletonBlock className="h-7 w-24" />
            </div>
          </div>
        ))}
      </div>

      <SkeletonBlock className="h-px w-full rounded-full" />
    </div>
  );
}

function TerminalSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[#0c0c0c]">
      <div className="flex h-10 items-center justify-between bg-[#161616] px-4">
        <div className="flex gap-2">
          <SkeletonBlock className="h-3 w-3 rounded-full bg-white/12" />
          <SkeletonBlock className="h-3 w-3 rounded-full bg-white/10" />
          <SkeletonBlock className="h-3 w-3 rounded-full bg-white/9" />
        </div>
        <SkeletonBlock className="h-6 w-28 rounded-md" />
        <SkeletonBlock className="h-5 w-14 rounded-md" />
      </div>

      <div className="flex h-8 items-center gap-2 bg-[#111] px-4">
        <SkeletonBlock className="h-2 w-10" />
        <SkeletonBlock className="h-2 w-20" />
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2 px-4 py-4">
        <SkeletonBlock className="h-2 w-36" />
        <SkeletonBlock className="h-2 w-48" />
        <SkeletonBlock className="h-2 w-32" />
        <SkeletonBlock className="h-2 w-44" />
        <SkeletonBlock className="h-2 w-28" />
        <SkeletonBlock className="h-2 w-52" />
        <div className="mt-3 flex items-center gap-2">
          <SkeletonBlock className="h-3 w-3 rounded-sm" />
          <SkeletonBlock className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}

function FocusSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-7 w-40 rounded-full" />
        <SkeletonBlock className="h-px flex-1 rounded-full" />
      </div>

      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-80 max-w-full" />
        <SkeletonBlock className="h-10 w-72 max-w-full" />
        <SkeletonBlock className="h-10 w-48 max-w-full" />
      </div>

      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-full max-w-lg" />
        <SkeletonBlock className="h-3 w-full max-w-md" />
      </div>

      <div className="mt-auto grid gap-4 md:grid-cols-2">
        <div className="space-y-3 pt-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-11/12" />
        </div>
        <div className="space-y-3 pt-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-10/12" />
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-3">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(223,255,31,0.14), transparent 36%), radial-gradient(circle at bottom right, rgba(223,255,31,0.08), transparent 32%)",
        }}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-black px-6 py-6">
        <SkeletonBlock className="mb-3 h-2.5 w-2.5 rounded-full bg-white/15" />
        <SkeletonBlock className="mb-4 h-24 w-24 rounded-full" />
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="mt-2 h-4 w-32" />
        <div className="mt-4 flex items-center gap-2">
          <SkeletonBlock className="h-5 w-5 rounded-full" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        <SkeletonBlock className="mt-4 h-4 w-28" />
        <SkeletonBlock className="mt-4 h-4 w-full" />
        <SkeletonBlock className="mt-auto h-10 w-full rounded-full" />
      </div>

      <div className="relative flex items-center justify-center gap-5 pt-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-6 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-4 w-2/3" />
      <SkeletonBlock className="h-4 w-1/3" />
    </div>
  );
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  height = "h-full",
  width = "w-full",
  className = "",
  variant = "default",
}) => {
  const content = {
    default: <DefaultSkeleton />,
    bento: <BentoSkeleton />,
    terminal: <TerminalSkeleton />,
    focus: <FocusSkeleton />,
    profile: <ProfileSkeleton />,
  }[variant];

  const shellClasses =
    variant === "profile"
      ? `relative overflow-hidden ${height} ${width} ${className}`
      : `relative overflow-hidden rounded-xl bg-[#1b1b1b] p-4 ${height} ${width} ${className}`;

  return (
    <div className={shellClasses}>
      {variant !== "profile" && (
        <div
          className="pointer-events-none absolute inset-0 animate-pulse"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 28%), radial-gradient(circle at bottom right, rgba(223,255,31,0.05), transparent 24%)",
          }}
        />
      )}
      <div className="relative h-full animate-pulse">{content}</div>
    </div>
  );
};

export default LoadingFallback;
