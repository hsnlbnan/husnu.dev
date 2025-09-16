"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { likedComponents } from "@/data/likedComponents";
import { PreviewModal } from "./PreviewModal";

interface PreviewRouteClientProps {
  id: number;
  mode: "modal" | "page";
}

export function PreviewRouteClient({ id, mode }: PreviewRouteClientProps) {
  const router = useRouter();
  const component = likedComponents.find((item) => item.id === id);

  useEffect(() => {
    if (!component) {
      router.replace("/liked");
    }
  }, [component, router]);

  if (!component) {
    return null;
  }

  const handleClose = () => {
    if (mode === "modal") {
      router.back();
    } else {
      router.push("/liked");
    }
  };

  const preview = (
    <PreviewModal
      isOpen
      onClose={handleClose}
      component={component.preview}
      title={component.title}
      inspired={component.inspired}
      isIntercepted
    />
  );

  if (mode === "page") {
    return <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">{preview}</div>;
  }

  return preview;
}
