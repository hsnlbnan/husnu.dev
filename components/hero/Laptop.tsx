"use client";

// MacBook benzeri laptop: alüminyum unibody, yuvarlatılmış kenarlar, parlak
// siyah çerçeve, instanced klavye, geniş trackpad ve menteşeden dönen ince
// kapak. Laptop yerelde +Z'ye bakacak şekilde modellenir; başlangıçta π
// döndürülmüş durur ki ekran kalabalığa (-Z), kapağın arkası kameraya dönsün.
import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Group,
  InstancedMesh,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PMREMGenerator,
  SpotLight,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { LAPTOP, LIME, PALETTE } from "./constants";
import { targets } from "./focus";
import { rig } from "./rig";
import { useScreenProjection } from "./ScreenContent";

const DEG = Math.PI / 180;

// Klavye düzeni: satır başına tuş genişlikleri (1 = standart tuş). Her satır
// 14.5 birim; en arkada yarım yükseklikte fonksiyon satırı.
const KEY_ROWS: { widths: number[]; depth: number }[] = [
  { widths: Array(14).fill(14.5 / 14), depth: 0.5 },
  { widths: [...Array(13).fill(1), 1.5], depth: 1 },
  { widths: [1.5, ...Array(13).fill(1)], depth: 1 },
  { widths: [1.8, ...Array(11).fill(1), 1.7], depth: 1 },
  { widths: [2.3, ...Array(10).fill(1), 2.2], depth: 1 },
  { widths: [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1], depth: 1 },
];
const KEY_UNIT = 0.078;
const KEY_GAP = 0.012;
const KEY_COUNT = KEY_ROWS.reduce((n, r) => n + r.widths.length, 0);

function Keyboard({ material }: { material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.18), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new Object3D();
    let i = 0;
    let z = -0.395; // menteşe tarafı
    for (const row of KEY_ROWS) {
      const d = row.depth * KEY_UNIT - KEY_GAP;
      let x = -(14.5 * KEY_UNIT) / 2;
      for (const w of row.widths) {
        const width = w * KEY_UNIT - KEY_GAP;
        o.position.set(x + (w * KEY_UNIT) / 2, LAPTOP.baseH + 0.003, z + d / 2);
        o.scale.set(width, 0.006, d);
        o.updateMatrix();
        mesh.setMatrixAt(i++, o.matrix);
        x += w * KEY_UNIT;
      }
      z += d + KEY_GAP;
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  return <instancedMesh ref={ref} args={[geometry, material, KEY_COUNT]} />;
}

type Props = {
  scale: number;
  screenPx: { width: number; height: number };
};

export default function Laptop({ scale, screenPx }: Props) {
  const gl = useThree((s) => s.gl);
  const lift = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const hinge = useRef<Group>(null);
  const screen = useRef<Mesh>(null);
  const glow = useRef<SpotLight>(null);
  const glowTarget = useMemo(() => new Object3D(), []);

  // Alüminyumun yansıtacağı prosedürel stüdyo ortamı; yalnızca laptop
  // materyallerine verilir, kalabalığın "mat kil" görünümü etkilenmez.
  const env = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  const materials = useMemo(
    () => ({
      aluminium: new MeshStandardMaterial({
        color: PALETTE.aluminium,
        metalness: 0.92,
        roughness: 0.36,
        envMap: env,
        envMapIntensity: 0.55,
      }),
      bezel: new MeshPhysicalMaterial({
        color: PALETTE.bezel,
        roughness: 0.12,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMap: env,
        envMapIntensity: 0.35,
      }),
      well: new MeshStandardMaterial({ color: "#2A2B2E", metalness: 0.7, roughness: 0.55, envMap: env, envMapIntensity: 0.3 }),
      keys: new MeshStandardMaterial({ color: PALETTE.keys, roughness: 0.7, metalness: 0.1 }),
      trackpad: new MeshStandardMaterial({
        color: "#7E8185",
        metalness: 0.6,
        roughness: 0.22,
        envMap: env,
        envMapIntensity: 0.45,
      }),
      grille: new MeshStandardMaterial({ color: "#1B1C1E", roughness: 0.9 }),
      hinge: new MeshStandardMaterial({ color: "#1F2023", metalness: 0.8, roughness: 0.4, envMap: env, envMapIntensity: 0.4 }),
      screen: new MeshStandardMaterial({
        color: PALETTE.screenOff,
        emissive: "#1c1f14",
        emissiveIntensity: 1,
        roughness: 0.25,
      }),
    }),
    [env]
  );

  // Kararma için gövde materyallerinin taban rengi ve yansıma şiddeti.
  const bodyTone = useMemo(
    () =>
      [materials.aluminium, materials.well, materials.keys, materials.trackpad, materials.grille, materials.hinge].map(
        (m) => [m, m.color.clone(), m.envMapIntensity] as const
      ),
    [materials]
  );

  useLayoutEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose());
      env.dispose();
    },
    [materials, env]
  );

  const { baseW, baseH, baseD, lidW, lidH, lidT, screenW, screenH, screenCenterY } = LAPTOP;

  const { anchor: screenAnchor, project: projectScreen, position: screenPos } = useScreenProjection(screenPx);

  useFrame(() => {
    if (!lift.current || !spin.current || !hinge.current) return;
    lift.current.position.y = rig.laptopLift;
    spin.current.rotation.y = Math.PI + rig.laptopRotY;
    hinge.current.rotation.x = -(rig.lidAngle - 90) * DEG;

    // Ekran başlangıçta da açık: ışığı kalabalığın yüzlerine vurur.
    materials.screen.emissiveIntensity = 1 + rig.screenOn * 1.5;
    // Dalışta gövde de kalabalıkla birlikte kararır: dik ekranda laptop ekranı
    // viewport'un yalnızca üstünü kaplar ve alttaki alüminyum şerit parlıyordu.
    const k = 1 - 0.94 * rig.crowdDim;
    for (const [m, base, env0] of bodyTone) {
      m.color.copy(base).multiplyScalar(k);
      m.envMapIntensity = env0 * k;
    }
    if (glow.current) glow.current.intensity = (1.1 + 0.7 * rig.screenOn) * (1 - rig.handoff);
    screen.current?.getWorldPosition(targets.laptop);
    // En sonda: kapak dönüşü bu karede uygulandıktan sonra ekranı yansıt.
    projectScreen();
  });

  return (
    <group position={[LAPTOP.position[0], LAPTOP.position[1], LAPTOP.position[2]]} scale={scale}>
      <group ref={lift}>
        <group ref={spin} rotation={[0, Math.PI, 0]}>
          {/* Unibody taban */}
          <RoundedBox
            args={[baseW, baseH, baseD]}
            radius={0.014}
            smoothness={4}
            position={[0, baseH / 2, 0]}
            material={materials.aluminium}
            castShadow
            receiveShadow
          />
          {/* Klavye yuvası, tuşlar, hoparlör ızgaraları, trackpad */}
          <mesh position={[0, baseH + 0.0006, -0.175]} rotation={[-Math.PI / 2, 0, 0]} material={materials.well}>
            <planeGeometry args={[14.5 * 0.078 + 0.02, 0.47]} />
          </mesh>
          <Keyboard material={materials.keys} />
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.635, baseH + 0.0006, -0.175]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={materials.grille}
            >
              <planeGeometry args={[0.05, 0.44]} />
            </mesh>
          ))}
          <RoundedBox
            args={[0.52, 0.002, 0.32]}
            radius={0.0009}
            smoothness={2}
            position={[0, baseH + 0.0004, 0.28]}
            material={materials.trackpad}
          />
          {/* Menteşe */}
          <mesh position={[0, baseH - 0.004, -baseD / 2 + 0.012]} rotation={[0, 0, Math.PI / 2]} material={materials.hinge}>
            <cylinderGeometry args={[0.011, 0.011, baseW * 0.8, 20]} />
          </mesh>

          {/* Kapak: menteşede döner */}
          <group ref={hinge} position={[0, baseH, -baseD / 2 + lidT / 2]} rotation={[-(LAPTOP.lidAngle - 90) * DEG, 0, 0]}>
            <RoundedBox
              args={[lidW, lidH, lidT]}
              radius={0.006}
              smoothness={3}
              position={[0, lidH / 2, 0]}
              material={materials.aluminium}
              castShadow
            />
            {/* Kenardan kenara parlak siyah cam çerçeve */}
            <mesh position={[0, lidH / 2, lidT / 2 + 0.0004]} material={materials.bezel}>
              <planeGeometry args={[lidW - 0.012, lidH - 0.012]} />
            </mesh>
            <mesh ref={screen} position={[0, screenCenterY, lidT / 2 + 0.0008]} material={materials.screen}>
              <planeGeometry args={[screenW, screenH]} />
            </mesh>
            {/* Kamera */}
            <mesh position={[0, lidH - 0.022, lidT / 2 + 0.0009]}>
              <circleGeometry args={[0.004, 16]} />
              <meshBasicMaterial color="#1a1d24" />
            </mesh>
            {/* Kapağın arkasında lime işaret */}
            <mesh position={[0, lidH / 2, -lidT / 2 - 0.0006]} rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.055, 48]} />
              <meshBasicMaterial color={LIME} toneMapped={false} />
            </mesh>

            {/* Ekran ışığı: ekran normali boyunca, laptopla birlikte döner. */}
            <primitive object={glowTarget} position={[0, screenCenterY, 2]} />
            <spotLight
              ref={glow}
              position={[0, screenCenterY, 0.25]}
              target={glowTarget}
              color={PALETTE.screenGlow}
              angle={1.05}
              penumbra={1}
              decay={0}
              distance={7}
              intensity={1.1}
            />

            <object3D ref={screenAnchor} position={screenPos} />
          </group>
        </group>
      </group>
    </group>
  );
}
