"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { buildSpec } from "./lib/spec";
import { renderWallpaper } from "./lib/render";
import { toWallpaperParams } from "./lib/config";
import { buildShortcutUrl, buildWallpaperUrl } from "./lib/wallpaper-url";
import { collapseMotion, enterMotion, staggerMotion } from "./lib/animations";
import { THEMES } from "./lib/theme";
import { DICT } from "./lib/i18n";
import { useWallpaperConfig } from "./hooks/useWallpaperConfig";
import { useRuntime } from "./hooks/useRuntime";
import { useCopyFeedback } from "./hooks/useCopyFeedback";
import Segmented from "./components/Segmented";
import Field from "./components/Field";
import ColorPicker from "./components/ColorPicker";
import LockScreen from "./components/LockScreen";

const PREVIEW_W = 360;
const PREVIEW_H = 780; // ~ 1290 : 2796 device aspect

// Ready-made iCloud shortcut (Get Contents of URL → Set Wallpaper). After
// importing, the user swaps in their own copied wallpaper link.
const ICLOUD_SHORTCUT =
  "https://www.icloud.com/shortcuts/24771c04e9344736860c765433252e71";

export default function Home() {
  const reduce = useReducedMotion() ?? false;

  const { config, set, applyTheme } = useWallpaperConfig();
  const runtime = useRuntime();
  const [copied, copy] = useCopyFeedback();

  const t = DICT[config.lang];

  // Computed only after mount (runtime.now is null on the server and the first
  // client render), so the preview never causes a hydration mismatch.
  const spec = useMemo(() => {
    if (!runtime.now) return null;
    return buildSpec(
      toWallpaperParams(config, {
        tz: runtime.tz,
        now: runtime.now,
        w: PREVIEW_W,
        h: PREVIEW_H,
      })
    );
  }, [config, runtime.tz, runtime.now]);

  const url = useMemo(
    () => buildWallpaperUrl(config, { origin: runtime.origin, tz: runtime.tz }),
    [config, runtime.origin, runtime.tz]
  );
  const shortcutUrl = buildShortcutUrl(runtime.origin, t.title, url);

  const dayWarn = config.mode === "period" && config.unit === "day";
  const freqNote = dayWarn ? t.freqDay : t.freqGood;

  const structuralKey = `${config.style}-${config.shape}-${config.cols}-${config.rows}-${config.mode}-${config.unit}-${config.lang}`;
  const enter = enterMotion(reduce);
  const collapse = collapseMotion(reduce);

  return (
    <div className="yp-scope"><div className="wrap">
      {/* ---------- Preview ---------- */}
      <motion.section className="preview-col" {...staggerMotion(reduce, 0)}>
        <div className="phone">
          <div className="screen" style={{ background: config.bg }}>
            <div className="island" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={structuralKey}
                initial={enter.initial}
                animate={enter.animate}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                style={{ width: PREVIEW_W, height: PREVIEW_H }}
              >
                {spec && renderWallpaper(spec)}
              </motion.div>
            </AnimatePresence>
            {config.showLock && runtime.now && (
              <LockScreen lang={config.lang} now={runtime.now} bg={config.bg} tz={runtime.tz} />
            )}
          </div>
        </div>
        <div className="preview-foot">
          <span className="preview-caption">{spec?.caption ?? ""}</span>
          <Segmented
            group="locktoggle"
            value={config.showLock ? "on" : "off"}
            onChange={(v) => set("showLock", v === "on")}
            reduce={reduce}
            options={[
              { value: "on", label: t.lockOn },
              { value: "off", label: t.lockOff },
            ]}
          />
        </div>
      </motion.section>

      {/* ---------- Controls ---------- */}
      <section className="controls-col">
        <motion.header className="head" {...staggerMotion(reduce, 1)}>
          <div className="head-top">
            <h1>{t.title}</h1>
            <Segmented
              group="lang"
              value={config.lang}
              onChange={(v) => set("lang", v)}
              reduce={reduce}
              options={[
                { value: "tr", label: "TR" },
                { value: "en", label: "EN" },
              ]}
            />
          </div>
          <p>{t.tagline}</p>
        </motion.header>

        <motion.div className="card" {...staggerMotion(reduce, 2)}>
          <Field label={t.track}>
            <Segmented
              group="mode"
              value={config.mode}
              onChange={(v) => set("mode", v)}
              reduce={reduce}
              options={[
                { value: "period", label: t.period },
                { value: "since", label: t.since },
                { value: "until", label: t.until },
                { value: "age", label: t.age },
              ]}
            />
          </Field>

          <AnimatePresence initial={false} mode="popLayout">
            {config.mode === "period" && (
              <motion.div key="unit" {...collapse} style={{ overflow: "hidden" }}>
                <Field label={t.periodLabel}>
                  <Segmented
                    group="unit"
                    value={config.unit}
                    onChange={(v) => set("unit", v)}
                    reduce={reduce}
                    options={[
                      { value: "day", label: t.unitDay },
                      { value: "week", label: t.unitWeek },
                      { value: "month", label: t.unitMonth },
                      { value: "year", label: t.unitYear },
                    ]}
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {config.mode === "since" && (
            <Field label={t.startDate}>
              <input
                type="date"
                value={config.sinceDate}
                onChange={(e) => set("sinceDate", e.target.value)}
              />
            </Field>
          )}
          {config.mode === "until" && (
            <Field label={t.targetDate}>
              <input
                type="date"
                value={config.untilDate}
                onChange={(e) => set("untilDate", e.target.value)}
              />
            </Field>
          )}
          {config.mode === "age" && (
            <Field label={t.birthDate}>
              <input
                type="date"
                value={config.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
              />
            </Field>
          )}
        </motion.div>

        <motion.div className="card" {...staggerMotion(reduce, 3)}>
          <Field label={t.style}>
            <Segmented
              group="style"
              value={config.style}
              onChange={(v) => set("style", v)}
              reduce={reduce}
              options={[
                { value: "grid", label: t.styleGrid },
                { value: "bar", label: t.styleBar },
                { value: "number", label: t.styleNumber },
              ]}
            />
          </Field>

          <AnimatePresence initial={false} mode="popLayout">
            {config.style === "grid" && (
              <motion.div key="grid-opts" {...collapse} style={{ overflow: "hidden", paddingBottom: 8 }}>
                <Field label={t.shape}>
                  <Segmented
                    group="shape"
                    value={config.shape}
                    onChange={(v) => set("shape", v)}
                    reduce={reduce}
                    options={[
                      { value: "circle", label: t.circle },
                      { value: "square", label: t.square },
                    ]}
                  />
                </Field>
                <div className="two">
                  <Field label={`${t.columns} · ${config.cols}`}>
                    <input
                      type="range"
                      min={6}
                      max={24}
                      value={config.cols}
                      onChange={(e) => set("cols", Number(e.target.value))}
                    />
                  </Field>
                  <Field label={`${t.rows} · ${config.rows}`}>
                    <input
                      type="range"
                      min={6}
                      max={40}
                      value={config.rows}
                      onChange={(e) => set("rows", Number(e.target.value))}
                    />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="two">
            <Field label={t.filledColor}>
              <ColorPicker value={config.fg} onChange={(c) => set("fg", c)} label={t.filledColor} />
            </Field>
            <Field label={t.background}>
              <ColorPicker value={config.bg} onChange={(c) => set("bg", c)} label={t.background} />
            </Field>
          </div>
          <div className="themes">
            {THEMES.map((theme) => (
              <button
                key={theme.fg + theme.bg}
                type="button"
                className="theme"
                onClick={() => applyTheme(theme.fg, theme.bg)}
                style={{ background: theme.bg }}
                aria-label={`${theme.fg} / ${theme.bg}`}
              >
                <span style={{ background: theme.fg }} />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" {...staggerMotion(reduce, 4)}>
          <Field label={t.linkLabel}>
            <div className="url-box">
              <span className="url-text mono">{url}</span>
            </div>
          </Field>
          <div className="actions">
            <button className="btn primary" onClick={() => copy(url)} type="button">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "yes" : "no"}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                >
                  {copied ? t.copied : t.copy}
                </motion.span>
              </AnimatePresence>
            </button>
            <a className="btn ghost" href={url} target="_blank" rel="noreferrer">
              {t.openPng}
            </a>
          </div>
        </motion.div>

        <motion.div className="card steps" {...staggerMotion(reduce, 5)}>
          <h2>{t.shortcutTitle}</h2>
          <p className="steps-intro">{t.shortcutIntro}</p>

          <div className="icloud">
            <a
              className="btn primary"
              href={ICLOUD_SHORTCUT}
              target="_blank"
              rel="noreferrer"
            >
              {t.icloudInstall}
            </a>
            <p className="hint">{t.icloudHint}</p>
          </div>

          <ol>
            {t.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          <div className={`freq${dayWarn ? " warn" : ""}`}>{freqNote}</div>

          <div className="actions">
            <a className="btn ghost" href="shortcuts://create-shortcut">
              {t.openShortcutsApp}
            </a>
            <a className="btn ghost" href={shortcutUrl}>
              {t.downloadShortcut}
            </a>
          </div>

          <details className="adv">
            <summary>{t.shortcutAdvanced}</summary>
            <p className="hint">{t.signHint}</p>
            <pre className="code-block">
              shortcuts sign --mode anyone --input {t.title}.shortcut --output {t.title}-signed.shortcut
            </pre>
          </details>

          <p className="hint">{t.shortcutNote}</p>
        </motion.div>

        <footer className="foot">
          {t.tzDetected}: <span className="mono">{runtime.tz}</span>
        </footer>
      </section>
    </div></div>
  );
}
