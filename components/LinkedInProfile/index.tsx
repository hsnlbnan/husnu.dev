"use client";

import { Verified } from "@/icons";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";
import { useState } from "react";

type SocialProfile = {
  id: string;
  platform: string;
  link: string;
  handle: string;
  role: string;
  metaLabel: string;
  location: string;
  footer: string;
  actionLabel: string;
  accent: string;
  surfaceGlow: string;
};

const PROFILES: SocialProfile[] = [
  {
    id: "linkedin",
    platform: "LinkedIn",
    link: "https://www.linkedin.com/in/husnu/",
    handle: "Hüsnü Lübnan",
    role: "Frontend Developer",
    metaLabel: "Ege Üniversitesi",
    location: "İzmir, Türkiye",
    footer: "500+ bağlantı",
    actionLabel: "Bağlantı Kur",
    accent: "#c37d16",
    surfaceGlow:
      "radial-gradient(circle at top left, rgba(223,255,31,0.16), transparent 36%), radial-gradient(circle at bottom right, rgba(179,255,130,0.1), transparent 34%)",
  },
  {
    id: "x",
    platform: "X",
    link: "https://twitter.com/hsnlbnan",
    handle: "@hsnlbnan",
    role: "Frontend Developer",
    metaLabel: "build notes",
    location: "x.com/hsnlbnan",
    footer: "UI experiments + product thoughts",
    actionLabel: "Takip Et",
    accent: "#f2f2f2",
    surfaceGlow:
      "radial-gradient(circle at top left, rgba(212,255,122,0.14), transparent 36%), radial-gradient(circle at bottom right, rgba(156,234,132,0.09), transparent 34%)",
  },
  {
    id: "instagram",
    platform: "Instagram",
    link: "https://www.instagram.com/hsnlbnan/",
    handle: "@hsnlbnan",
    role: "Frontend Developer",
    metaLabel: "visual diary",
    location: "instagram.com/hsnlbnan",
    footer: "Frames, process, and daily captures",
    actionLabel: "Profili Aç",
    accent: "#f59eae",
    surfaceGlow:
      "radial-gradient(circle at top left, rgba(223,255,31,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(214,255,110,0.11), transparent 30%)",
  },
  {
    id: "github",
    platform: "GitHub",
    link: "https://github.com/hsnlbnan",
    handle: "hsnlbnan",
    role: "Frontend Developer",
    metaLabel: "open source",
    location: "github.com/hsnlbnan",
    footer: "Experiments, and shipped work",
    actionLabel: "Projeleri Gör",
    accent: "#f2f2f2",
    surfaceGlow:
      "radial-gradient(circle at top left, rgba(196,255,118,0.14), transparent 38%), radial-gradient(circle at bottom right, rgba(223,255,31,0.08), transparent 32%)",
  },
];

const swipeThreshold = 70;
const PLATFORM_ICON_SIZE = "h-4 w-4";

function toRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((value) => value + value)
          .join("")
      : sanitized;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function XIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      style={color ? { color } : undefined}
    >
      <path d="M18.901 2H21l-6.872 7.854L22.2 22h-6.321l-4.95-7.489L4.374 22H2.27l7.351-8.402L1.8 2h6.482l4.475 6.83zM17.79 20.12h1.163L7.65 3.782H6.402z" />
    </svg>
  );
}

function PlatformGlyph({
  profile,
  className,
  colorOverride,
}: {
  profile: SocialProfile;
  className?: string;
  colorOverride?: string;
}) {
  const glyphColor = colorOverride ?? profile.accent;

  if (profile.id === "linkedin") {
    return <FiLinkedin className={className} color={glyphColor} />;
  }

  if (profile.id === "instagram") {
    return <FiInstagram className={className} color={glyphColor} />;
  }

  if (profile.id === "github") {
    return <FiGithub className={className} color={glyphColor} />;
  }

  return <XIcon className={className} color={glyphColor} />;
}

function MetaRow({ profile }: { profile: SocialProfile }) {
  if (profile.id === "linkedin") {
    return (
      <div className="flex items-center gap-2 my-2 text-gray-500">
        <Image src="/ege.jpeg" alt="Ege Üniversitesi" width={20} height={20} />
        <p className="text-gray-200">{profile.metaLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 my-2 text-gray-500">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border"
        style={{
          background: toRgba(profile.accent, 0.1),
          borderColor: toRgba(profile.accent, 0.18),
        }}
      >
        <PlatformGlyph profile={profile} className={PLATFORM_ICON_SIZE} />
      </span>
      <p className="text-gray-200">{profile.metaLabel}</p>
    </div>
  );
}

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 18 : -18,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -18 : 18,
    opacity: 0,
  }),
};

const ProfileCard = () => {
  const prefersReducedMotion = useReducedMotion();
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const activeProfile = PROFILES[index];
  const accentSoft = toRgba(activeProfile.accent, 0.08);
  const accentBorder = toRgba(activeProfile.accent, 0.2);

  function goTo(nextIndex: number) {
    const wrappedIndex = (nextIndex + PROFILES.length) % PROFILES.length;
    if (wrappedIndex === index) {
      return;
    }
    const nextDirection = wrappedIndex > index ? 1 : -1;
    setIndex([wrappedIndex, nextDirection]);
  }

  function paginate(nextDirection: number) {
    setIndex(([current]) => [
      (current + nextDirection + PROFILES.length) % PROFILES.length,
      nextDirection,
    ]);
  }

  function handleAction() {
    window.open(activeProfile.link, "_blank", "noopener,noreferrer");
  }

  function handlePanEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.x <= -swipeThreshold) {
      paginate(1);
      return;
    }

    if (info.offset.x >= swipeThreshold) {
      paginate(-1);
    }
  }

  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-3">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`surface-${activeProfile.id}`}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
          }
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: activeProfile.surfaceGlow,
          }}
        />
      </AnimatePresence>

      <motion.div
        onPanEnd={handlePanEnd}
        style={{ touchAction: "pan-y" }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/6 bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeProfile.id}
            custom={direction}
            variants={contentVariants}
            initial={prefersReducedMotion ? { opacity: 1 } : "enter"}
            animate="center"
            exit={prefersReducedMotion ? { opacity: 1 } : "exit"}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.26, ease: [0.16, 1, 0.3, 1] }
            }
            className="relative h-full w-full px-4 py-4"
          >
            <div className="relative flex h-full flex-col px-2">
              <div className="mb-3 flex items-center">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: activeProfile.accent,
                    boxShadow: `0 0 16px ${toRgba(activeProfile.accent, 0.45)}`,
                  }}
                />
              </div>

              <div className="relative mb-4 h-24 w-24">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    padding: 2,
                    background:
                      activeProfile.id === "instagram"
                        ? "linear-gradient(135deg, rgba(245,158,174,0.95), rgba(223,255,31,0.28))"
                        : accentSoft,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
                    <Image
                      src="/me.webp"
                      alt="Profile Picture"
                      fill
                      sizes="96px"
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-xl text-[#dfff1f]">
                    {activeProfile.handle}
                  </h2>
                  <Verified className="h-4 w-4 text-white" />
                </div>
                <PlatformGlyph
                  profile={activeProfile}
                  className={`${PLATFORM_ICON_SIZE} flex-shrink-0`}
                />
              </div>

              <p className="mb-2 text-gray-200">{activeProfile.role}</p>

              <MetaRow profile={activeProfile} />

              <p className="mt-2 text-sm text-gray-400">
                {activeProfile.location}
              </p>

              <div className="mt-4 w-full">
                <p className="text-sm text-gray-200">{activeProfile.footer}</p>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={handleAction}
                  className="flex w-full items-center justify-center rounded-full bg-[#dfff1f] px-4 py-2 text-sm text-black transition-all duration-300 hover:bg-[#dfff1f88]"
                >
                  {activeProfile.actionLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center justify-center gap-5 pt-1">
        {PROFILES.map((profile, profileIndex) => {
          const isActive = profileIndex === index;
          return (
            <motion.button
              key={profile.id}
              type="button"
              onClick={() => goTo(profileIndex)}
              aria-label={profile.platform}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              className="flex h-8 w-8 items-center justify-center transition-opacity duration-200"
              style={{
                opacity: isActive ? 1 : 0.42,
              }}
            >
              <PlatformGlyph
                profile={profile}
                className={PLATFORM_ICON_SIZE}
                colorOverride="#ffffff"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCard;
