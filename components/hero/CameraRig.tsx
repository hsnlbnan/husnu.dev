"use client";

// camT (0..1) → kamera pozu. Bitiş pozu sabit değil; her boyut değişiminde
// ekran düzleminden hesaplanır (DESIGN.md §7).
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import { LAPTOP } from "./constants";
import type { SceneLayout } from "./quality";
import { rig } from "./rig";

const lookTarget = new Vector3();

/**
 * Ekran viewport'u tam GENİŞLİĞİNE oturur (d = dW) ve ekranın üst kenarı
 * viewport'un üst kenarına hizalanır.
 *
 * DESIGN.md "cover" için min(dH, dW) diyor; burada bilinçli olarak hep dW
 * kullanılıyor: devirde ekrandaki klon ile gerçek DOM'un piksel piksel
 * örtüşebildiği tek poz bu. 16:10'dan dar yatay ekranlarda (1440×1000, 4:3)
 * ve dikey ekranlarda ekranın altında, devre kadar sönen sahneden bir bant
 * kalır; 16:10'dan geniş ekranlarda ekranın alt kısmı viewport dışına taşar.
 */
export function computeEndPose(layout: SceneLayout, aspect: number) {
  const s = layout.laptopScale;
  const [lx, ly, lz] = LAPTOP.position;
  // Bitişte laptop tam dönmüş (yerel = dünya yönü), kapak 90°, kaldırma 0.
  const center = new Vector3(
    lx,
    ly + s * (LAPTOP.baseH + LAPTOP.screenCenterY),
    lz + s * (-LAPTOP.baseD / 2 + LAPTOP.lidT / 2 + LAPTOP.lidT / 2 + 0.002)
  );
  const w = LAPTOP.screenW * s;
  const h = LAPTOP.screenH * s;
  const tanHalf = Math.tan((layout.fov * Math.PI) / 360);
  const d = w / 2 / (tanHalf * aspect);
  const visibleHalfH = d * tanHalf;
  const offsetY = h / 2 - visibleHalfH;
  const target = center.clone().add(new Vector3(0, offsetY, 0));
  const position = target.clone().add(new Vector3(0, 0, d));
  return { position, target };
}

export default function CameraRig({ layout }: { layout: SceneLayout }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);

  const poses = useMemo(() => {
    const end = computeEndPose(layout, aspect);
    return {
      startPos: new Vector3(...layout.camPos),
      startTarget: new Vector3(...layout.camTarget),
      endPos: end.position,
      endTarget: end.target,
    };
  }, [layout, aspect]);

  useLayoutEffect(() => {
    camera.fov = layout.fov;
    camera.near = 0.05;
    camera.far = 60;
    camera.updateProjectionMatrix();
  }, [camera, layout.fov]);

  useFrame(() => {
    const t = rig.camT;
    camera.position.lerpVectors(poses.startPos, poses.endPos, t);
    lookTarget.lerpVectors(poses.startTarget, poses.endTarget, t);
    camera.lookAt(lookTarget);
  });

  return null;
}
