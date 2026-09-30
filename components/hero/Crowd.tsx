"use client";

// Kalabalık: config'i dolaşır, karakterleri kurar ve tüm görünen parçaları
// geometri başına tek InstancedMesh ile çizer. Bakış, kırpma, nefes ve scroll
// tepkileri `useFrame` içinde; setState ve kare başına tahsis yok.
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { LIMITS, rigCharacter, type GeoKey, type Part, type RiggedCharacter } from "./anatomy";
import type { CharacterConfig } from "./characters.config";
import { targets, updateCursorTarget } from "./focus";
import { rig } from "./rig";

const GEO_KEYS: GeoKey[] = ["sphere", "ball", "hemisphere", "body", "brow", "cylinder", "torus", "halfTorus", "cone"];

function makeGeometry(key: GeoKey, seg: number): BufferGeometry {
  switch (key) {
    case "sphere":
      return new SphereGeometry(1, seg, Math.round(seg * 0.75));
    case "ball":
      // Göz, göz bebeği, kapak gibi küçük parçalar: düşük poligon yeterli.
      return new SphereGeometry(1, Math.max(16, Math.round(seg / 2)), Math.max(12, Math.round(seg / 3)));
    case "hemisphere":
      return new SphereGeometry(1, seg, Math.round(seg / 3), 0, Math.PI * 2, 0, Math.PI / 2);
    case "body":
      return new CapsuleGeometry(0.42, 0.76, 8, Math.max(16, seg / 2));
    case "brow":
      return new CapsuleGeometry(0.02, 0.12, 4, 8).rotateZ(Math.PI / 2);
    case "cylinder":
      return new CylinderGeometry(1, 1, 1, 16);
    case "torus":
      return new TorusGeometry(1, 0.16, 10, 32);
    case "halfTorus":
      return new TorusGeometry(1, 0.1, 8, 24, Math.PI);
    case "cone":
      return new ConeGeometry(1, 1, 12);
  }
}

const focus = new Vector3();
const DEG = Math.PI / 180;

type Props = {
  characters: CharacterConfig[];
  segments: number;
  sheen: boolean;
  shadows: boolean;
  /** Azaltılmış hareket: boşta animasyonlar ve imleç takibi kapalı. */
  still?: boolean;
};

export default function Crowd({ characters, segments, sheen, shadows, still = false }: Props) {
  const meshRefs = useRef<Partial<Record<GeoKey, InstancedMesh>>>({});
  const nextLookAway = useRef(4);
  const groupRef = useRef<Group>(null);

  const { rigged, buckets, crowdRoot } = useMemo(() => {
    const crowdRoot = new Object3D();
    const rigged: RiggedCharacter[] = [];
    const buckets = Object.fromEntries(GEO_KEYS.map((k) => [k, [] as Part[]])) as Record<GeoKey, Part[]>;
    for (const cfg of characters) {
      const { rigged: r, parts } = rigCharacter(cfg);
      crowdRoot.add(r.root);
      rigged.push(r);
      for (const p of parts) buckets[p.geo].push(p);
    }
    return { rigged, buckets, crowdRoot };
  }, [characters]);

  const geometries = useMemo(
    () => Object.fromEntries(GEO_KEYS.map((k) => [k, makeGeometry(k, segments)])) as Record<GeoKey, BufferGeometry>,
    [segments]
  );

  // Tek paylaşılan "mat kil" materyali; renkler instance rengi olarak gelir.
  const material = useMemo(
    () =>
      sheen
        ? new MeshPhysicalMaterial({ roughness: 0.55, metalness: 0, sheen: 0.4, sheenRoughness: 0.6 })
        : new MeshStandardMaterial({ roughness: 0.55, metalness: 0 }),
    [sheen]
  );

  useLayoutEffect(() => {
    for (const key of GEO_KEYS) {
      const mesh = meshRefs.current[key];
      if (!mesh) continue;
      mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      buckets[key].forEach((p, i) => mesh.setColorAt(i, p.color));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [buckets, geometries, material]);

  useLayoutEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
    },
    [geometries]
  );
  useLayoutEffect(() => () => material.dispose(), [material]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1);
    const t = state.clock.elapsedTime;

    if (!still) updateCursorTarget(state.camera, t, dt);
    focus.lerpVectors(targets.cursor, targets.laptop, rig.focusMix);

    // Faz A'da ara sıra bir karakter kısa süre laptop ekranına bakar.
    if (!still && t > nextLookAway.current) {
      nextLookAway.current = t + 4 + Math.random() * 5;
      if (rig.focusMix < 0.1 && rigged.length) {
        rigged[Math.floor(Math.random() * rigged.length)].state.lookAwayUntil = t + 0.8;
      }
    }

    const spread = rig.crowdSpread;
    // Kararma: instance renkleri materyal rengiyle çarpılır. Tam karardığında
    // kalabalık hiç çizilmez: dikey ekranlarda bitiş kamerası masa düzleminin
    // altına iner ve ekranın altındaki bantta gövdeler görünürdü.
    material.color.setScalar(1 - 0.9 * rig.crowdDim);
    if (groupRef.current) groupRef.current.visible = rig.crowdDim < 0.995;
    if (rig.crowdDim >= 0.995) return;

    for (const c of rigged) {
      const { cfg, root, pivot, state: st } = c;
      const s = cfg.scale;
      const phase = cfg.phase;

      // Ön sıra ekranı görmek için yana açılıp öne eğilir; kahraman en çok.
      const front = cfg.row === 0;
      const lean = (front ? (cfg.hero ? 16 : 10) : cfg.row === 1 ? 4 : 2) * DEG * spread;
      root.position.x = c.baseX + (front ? cfg.side * 0.5 * spread : 0);
      root.position.y = c.baseY + (still ? 0 : Math.sin(t * 0.9 + phase) * 0.015) + (cfg.row === 1 ? 0.08 * spread : 0);

      const target = !still && st.lookAwayUntil > t ? targets.laptop : focus;
      const dx = target.x - root.position.x;
      const dy = target.y - (root.position.y + 0.36 * s);
      const dz = target.z - root.position.z;
      const yawT = Math.atan2(dx, dz);
      const pitchT = Math.atan2(dy, Math.hypot(dx, dz));
      const yawC = MathUtils.clamp(yawT, -cfg.maxYaw, cfg.maxYaw);
      const pitchC = MathUtils.clamp(pitchT, LIMITS.pitchDown, LIMITS.pitchUp);

      if (still) {
        st.yaw = yawC;
        st.pitch = pitchC;
      } else {
        st.yaw = MathUtils.damp(st.yaw, yawC, cfg.stiffness, dt);
        st.pitch = MathUtils.damp(st.pitch, pitchC, cfg.stiffness, dt);
      }

      // Önce gözler döner: kafanın henüz yetişemediği (ya da sınır yüzünden
      // hiç karşılayamadığı) açı göz bebeklerine kayma olarak verilir.
      const pxT = MathUtils.clamp((yawT - st.yaw) / 0.45, -1, 1);
      const pyT = MathUtils.clamp((pitchT - st.pitch) / 0.45, -1, 1);
      st.px = still ? pxT : MathUtils.damp(st.px, pxT, 12, dt);
      st.py = still ? pyT : MathUtils.damp(st.py, pyT, 12, dt);

      const sway = still ? 0 : Math.sin(t * 0.6 + phase) * LIMITS.sway;
      pivot.rotation.set(-st.pitch + sway * 0.5, st.yaw, sway);
      root.rotation.set(lean, 0, -st.yaw * 0.15);

      // Göz bebekleri göz akının ön yüzeyinde kayar, dışına taşmaz.
      for (let i = 0; i < 2; i++) {
        const e = c.eyes[i];
        const ox = st.px * c.pupilRange;
        const oy = st.py * c.pupilRange;
        const k = Math.min(1, (ox * ox + oy * oy) / (e.r * e.r));
        c.pupils[i].position.set(e.x + ox, e.y + oy, e.z + e.r * e.depth * Math.sqrt(1 - k) - 0.004 * s);
      }

      // Kırpma: 120 ms kapanış + 120 ms açılış.
      let blink = 0;
      if (!still) {
        const cycle = (t + cfg.blinkOffset) % cfg.blinkInterval;
        if (cycle < 0.24) blink = 1 - Math.abs(cycle - 0.12) / 0.12;
      }
      for (let i = 0; i < 2; i++) {
        const closure = Math.max(c.lidBase[i], blink);
        const lid = c.lids[i];
        const e = c.eyes[i];
        if (closure < 0.01) {
          lid.scale.set(0, 0, 0);
        } else {
          lid.scale.set(c.lidR, closure * c.lidR, c.lidR * 0.62);
          lid.position.y = e.y + (1 - closure) * c.lidR;
        }
      }
    }

    crowdRoot.updateMatrixWorld(true);
    for (const key of GEO_KEYS) {
      const mesh = meshRefs.current[key];
      if (!mesh) continue;
      const parts = buckets[key];
      for (let i = 0; i < parts.length; i++) mesh.setMatrixAt(i, parts[i].node.matrixWorld);
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {GEO_KEYS.map((key) =>
        buckets[key].length ? (
          <instancedMesh
            key={`${key}-${segments}-${buckets[key].length}`}
            ref={(m) => {
              if (m) meshRefs.current[key] = m;
              else delete meshRefs.current[key];
            }}
            args={[geometries[key], material, buckets[key].length]}
            frustumCulled={false}
            castShadow={shadows}
            receiveShadow={shadows}
          />
        ) : null
      )}
    </group>
  );
}
