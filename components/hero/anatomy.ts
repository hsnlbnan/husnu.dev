// Karakter anatomisi ve aksesuarları (DESIGN.md §4).
//
// Her karakter görünmez bir Object3D ağacı olarak kurulur (root → pivot →
// head → parçalar). Görünen her parça bir "Part"tır: hangi paylaşılan
// geometride çizileceği + dünya matrisini veren düğüm + rengi. Crowd bu
// parçaları geometri başına tek bir InstancedMesh'te toplar; böylece 22
// karakter ~8 draw call'a sığar.
import { Color, Object3D } from "three";
import type { AccessoryKind, CharacterConfig } from "./characters.config";
import { PALETTE } from "./constants";

export type GeoKey = "sphere" | "ball" | "hemisphere" | "body" | "brow" | "cylinder" | "torus" | "halfTorus" | "cone";

export type Part = { geo: GeoKey; node: Object3D; color: Color };

export type RiggedCharacter = {
  cfg: CharacterConfig;
  root: Object3D;
  pivot: Object3D;
  baseY: number;
  baseX: number;
  eyes: { x: number; y: number; z: number; r: number; depth: number }[];
  pupils: Object3D[];
  lids: Object3D[];
  lidR: number;
  lidBase: [number, number];
  pupilRange: number;
  state: {
    yaw: number;
    pitch: number;
    px: number;
    py: number;
    lookAwayUntil: number;
  };
};

type Vec3 = [number, number, number];

const DEG = Math.PI / 180;

// Kaş eğimleri [sol, sağ] (z dönüşü) ve sol kaşın ek yüksekliği.
const BROW_POSE: Record<CharacterConfig["brows"], { rot: [number, number]; lift: [number, number] }> = {
  neutral: { rot: [0.05, -0.05], lift: [0, 0] },
  curious: { rot: [-0.18, -0.05], lift: [0.035, 0] },
  frown: { rot: [-0.32, 0.32], lift: [-0.01, -0.01] },
  sad: { rot: [0.28, -0.28], lift: [0.01, 0.01] },
};

export function rigCharacter(cfg: CharacterConfig): { rigged: RiggedCharacter; parts: Part[] } {
  const s = cfg.scale;
  const parts: Part[] = [];
  const headColor = new Color(cfg.color);
  const accColor = new Color(cfg.accessoryColor || "#000");

  const node = (parent: Object3D, pos: Vec3 = [0, 0, 0], scale: Vec3 = [1, 1, 1], rot: Vec3 = [0, 0, 0]) => {
    const o = new Object3D();
    o.position.set(pos[0], pos[1], pos[2]);
    o.scale.set(scale[0], scale[1], scale[2]);
    o.rotation.set(rot[0], rot[1], rot[2]);
    parent.add(o);
    return o;
  };
  const part = (geo: GeoKey, parent: Object3D, color: Color, pos?: Vec3, scale?: Vec3, rot?: Vec3) => {
    const o = node(parent, pos, scale, rot);
    parts.push({ geo, node: o, color });
    return o;
  };

  const root = new Object3D();
  root.position.set(cfg.position[0], cfg.position[1], cfg.position[2]);

  // Gövde: kapsül, üstü boyun noktasının hemen altında.
  part("body", root, new Color(PALETTE.body), [0, -0.78 * s, 0], [s, s, s]);

  const pivot = node(root);
  pivot.rotation.order = "YXZ";
  const head = node(pivot, [0, 0.36 * s, 0]);

  const R = 0.4 * s;
  part("sphere", head, headColor, [0, 0, 0], [R, R * cfg.squash, R]);

  // Gözler
  const eyeK = cfg.eyes === "big" ? 1.2 : cfg.eyes === "surprised" ? 1.1 : 1;
  const pupilK = cfg.eyes === "surprised" ? 0.65 : cfg.eyes === "big" ? 1.1 : 1;
  const eyeR = 0.115 * s * eyeK;
  const eyeDepth = 0.55;
  const eyeY = 0.05 * s;
  const eyeZ = 0.345 * s;
  const white = new Color(PALETTE.eyeWhite);
  const black = new Color(PALETTE.pupil);
  const eyes: RiggedCharacter["eyes"] = [];
  const pupils: Object3D[] = [];
  const lids: Object3D[] = [];
  const lidR = eyeR * 1.05;
  const pupilR = 0.055 * s * pupilK;

  for (const side of [-1, 1] as const) {
    const x = side * 0.15 * s;
    eyes.push({ x, y: eyeY, z: eyeZ, r: eyeR, depth: eyeDepth });
    part("ball", head, white, [x, eyeY, eyeZ], [eyeR, eyeR, eyeR * eyeDepth]);
    pupils.push(part("ball", head, black, [x, eyeY, eyeZ + eyeR * eyeDepth], [pupilR, pupilR, pupilR * 0.45]));
    // Göz kapağı: kafa renginde, gözden biraz büyük; kapanma = y ölçeği.
    lids.push(part("ball", head, headColor, [x, eyeY + lidR, eyeZ + 0.004 * s], [lidR, 0, lidR * 0.62]));

    const i = side === -1 ? 0 : 1;
    const pose = BROW_POSE[cfg.brows];
    part(
      "brow",
      head,
      black,
      [x, eyeY + eyeR + 0.07 * s + pose.lift[i] * s, eyeZ - 0.01 * s],
      [s, s, s],
      [0, 0, pose.rot[i]]
    );
  }

  const lidBase: [number, number] =
    cfg.eyes === "squint" ? [0.35, 0.35] : cfg.eyes === "wink" ? [0.55, 0] : [0, 0];

  if (cfg.accessory) {
    addAccessory(cfg.accessory, { s, R, head, root, eyes, color: accColor, headColor, part });
  }

  return {
    rigged: {
      cfg,
      root,
      pivot,
      baseY: cfg.position[1],
      baseX: cfg.position[0],
      eyes,
      pupils,
      lids,
      lidR,
      lidBase,
      pupilRange: 0.04 * s,
      state: { yaw: 0, pitch: 0, px: 0, py: 0, lookAwayUntil: 0 },
    },
    parts,
  };
}

type AccessoryCtx = {
  s: number;
  R: number;
  head: Object3D;
  root: Object3D;
  eyes: RiggedCharacter["eyes"];
  color: Color;
  headColor: Color;
  part: (geo: GeoKey, parent: Object3D, color: Color, pos?: Vec3, scale?: Vec3, rot?: Vec3) => Object3D;
};

function addAccessory(kind: AccessoryKind, { s, R, head, root, eyes, color, part }: AccessoryCtx) {
  switch (kind) {
    case "glasses": {
      // Yuvarlak gözlük: iki halka + köprü.
      for (const e of eyes) {
        const r = e.r * 1.35;
        part("torus", head, color, [e.x, e.y, e.z + e.r * e.depth + 0.02 * s], [r, r, r]);
      }
      part("cylinder", head, color, [0, eyes[0].y + 0.01 * s, eyes[0].z + 0.06 * s], [0.012 * s, 0.07 * s, 0.012 * s], [0, 0, Math.PI / 2]);
      break;
    }
    case "headphones": {
      part("halfTorus", head, color, [0, 0.02 * s, -0.02 * s], [R * 1.1, R * 1.08, R * 1.1]);
      for (const side of [-1, 1]) {
        part("cylinder", head, color, [side * R * 1.02, 0, 0], [0.13 * s, 0.09 * s, 0.13 * s], [0, 0, Math.PI / 2]);
      }
      break;
    }
    case "beanie": {
      part("hemisphere", head, color, [0, 0.1 * s, -0.01 * s], [R * 1.06, R * 0.95, R * 1.06], [-0.12, 0, 0]);
      part("torus", head, color, [0, 0.12 * s, 0], [R * 1.02, R * 1.02, R * 0.7], [Math.PI / 2 - 0.12, 0, 0]);
      part("ball", head, color, [0, R * 1.18, -0.06 * s], [0.085 * s, 0.085 * s, 0.085 * s]);
      break;
    }
    case "cap": {
      part("hemisphere", head, color, [0, 0.1 * s, 0], [R * 1.04, R * 0.78, R * 1.04], [-0.08, 0, 0]);
      part("cylinder", head, color, [0, 0.13 * s, R * 0.95], [0.26 * s, 0.018 * s, 0.2 * s], [0.12, 0, 0]);
      break;
    }
    case "antenna": {
      part("cylinder", head, color, [0, R * 1.2, 0], [0.012 * s, 0.24 * s, 0.012 * s]);
      part("ball", head, color, [0, R * 1.52, 0], [0.055 * s, 0.055 * s, 0.055 * s]);
      break;
    }
    case "bowtie": {
      const y = -0.12 * s;
      const z = 0.34 * s;
      part("cone", root, color, [-0.055 * s, y, z], [0.055 * s, 0.09 * s, 0.03 * s], [0, 0, -Math.PI / 2]);
      part("cone", root, color, [0.055 * s, y, z], [0.055 * s, 0.09 * s, 0.03 * s], [0, 0, Math.PI / 2]);
      part("ball", root, color, [0, y, z + 0.01 * s], [0.03 * s, 0.03 * s, 0.03 * s]);
      break;
    }
    case "curls": {
      const count = 7;
      for (let i = 0; i < count; i++) {
        const a = (i / (count - 1) - 0.5) * Math.PI * 0.95;
        const lift = 0.9 - Math.abs(a) * 0.18;
        const r = (0.12 - Math.abs(a) * 0.02) * s;
        part("ball", head, color, [Math.sin(a) * R * 0.78, R * lift, -0.05 * s + Math.cos(a * 2) * 0.03 * s], [r, r, r]);
      }
      break;
    }
    case "bandana": {
      part("torus", head, color, [0, 0.16 * s, -0.01 * s], [R * 0.98, R * 0.98, R * 0.9], [Math.PI / 2 - 0.22, 0, 0]);
      part("ball", head, color, [0.08 * s, 0.2 * s, -R * 1.0], [0.06 * s, 0.05 * s, 0.05 * s]);
      break;
    }
    case "pencil": {
      const side = 1;
      part("cylinder", head, color, [side * R * 0.98, 0.1 * s, -0.04 * s], [0.022 * s, 0.3 * s, 0.022 * s], [0.2, 0, side * 0.45]);
      part("cone", head, new Color("#E8C9A9"), [side * (R * 0.98 + 0.07 * s), 0.1 * s - 0.14 * s, -0.01 * s], [0.022 * s, 0.05 * s, 0.022 * s], [0.2, 0, side * 0.45 + Math.PI]);
      break;
    }
  }
}

export const LIMITS = {
  pitchDown: -18 * DEG,
  pitchUp: 24 * DEG,
  sway: 1.2 * DEG,
};
