"use client";

// Işıklar, arka hale, masa, laptop, kalabalık ve kamera (DESIGN.md §3, §5).
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, Color, ShaderMaterial } from "three";
import type { CharacterConfig } from "./characters.config";
import CameraRig from "./CameraRig";
import { LIME, PALETTE } from "./constants";
import Crowd from "./Crowd";
import Laptop from "./Laptop";
import { rig } from "./rig";
import type { SceneLayout, TierSettings } from "./quality";

function radialMaterial(color: string, opacity: number, falloff: number, additive = false) {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(color) },
      uOpacity: { value: opacity },
      uFalloff: { value: falloff },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uFalloff;
      varying vec2 vUv;
      void main() {
        float d = clamp(distance(vUv, vec2(0.5)) * 2.0, 0.0, 1.0);
        float a = pow(1.0 - d, uFalloff) * uOpacity;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: false,
    ...(additive ? { blending: AdditiveBlending } : {}),
  });
}

type Props = {
  layout: SceneLayout;
  characters: CharacterConfig[];
  tier: TierSettings;
  screenPx: { width: number; height: number };
  still: boolean;
};

export default function Scene({ layout, characters, tier, screenPx, still }: Props) {
  const halo = useMemo(() => radialMaterial(LIME, 0.22, 1.6, true), []);
  const contact = useMemo(() => radialMaterial("#000000", 0.85, 1.4), []);

  // Dalışta arka hale de kalabalıkla birlikte söner.
  useFrame(() => {
    halo.uniforms.uOpacity.value = 0.22 * (1 - 0.85 * rig.crowdDim);
  });

  return (
    <>
      <color attach="background" args={[PALETTE.background]} />
      <fog attach="fog" args={[PALETTE.background, 8, 16]} />

      {/* Key: ana form. Gölge yalnızca yüksek katmanda. */}
      <spotLight
        position={[2.5, 6, 7]}
        color={PALETTE.key}
        intensity={2.2}
        angle={0.55}
        penumbra={0.8}
        decay={0}
        castShadow={tier.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      {/* Fill: sağdan serin mor dolgu */}
      <pointLight position={[5, 2, 3]} color={PALETTE.fill} intensity={1.2} decay={0} distance={14} />
      {/* Rim: soldan-arkadan marka rengi kontur */}
      <pointLight position={[-5, 3.5, -2]} color={PALETTE.rim} intensity={1.6} decay={0} distance={14} />
      <hemisphereLight args={[PALETTE.hemiSky, PALETTE.hemiGround, 0.35]} />

      {/* Arka hale */}
      <mesh position={[0, 1.6, -4]} material={halo}>
        <planeGeometry args={[10, 10]} />
      </mesh>

      {/* Masa / zemin: kameranın altına kadar uzanır. Dik (mobil) kamera
          masanın ön kenarının ötesini de görüyordu; orada siyah bir bant
          kalıyordu. Uzak kısım sisle arka plana karışır. */}
      <mesh position={[0, 0, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color={PALETTE.table} roughness={0.9} />
      </mesh>
      {/* Laptopun altında sahte temas gölgesi */}
      <mesh position={[0, 0.002, 3.3]} rotation={[-Math.PI / 2, 0, 0]} scale={layout.laptopScale} material={contact}>
        <planeGeometry args={[2.2, 1.7]} />
      </mesh>

      {/* Kamera ilk: useFrame sırası kayıt sırasıdır; laptop ekran projeksiyonu
          ve kalabalığın imleç ışını o karenin kamerasını kullanmalı. */}
      <CameraRig layout={layout} />
      <Laptop scale={layout.laptopScale} screenPx={screenPx} />
      <Crowd
        characters={characters}
        segments={tier.sphereSegments}
        sheen={tier.sheen}
        shadows={tier.shadows}
        still={still}
      />
    </>
  );
}
