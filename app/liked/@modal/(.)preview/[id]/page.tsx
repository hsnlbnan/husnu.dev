"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { likedComponents } from '../../../page';
import { PreviewModal } from '@/components/LikedComponents/PreviewModal';

export default function InterceptedPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  // Force render after mounting
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Find the component with matching id
  const component = likedComponents.find(comp => comp.id === id);

  // If component not found, redirect back to /liked
  if (!component) {
    router.push('/liked');
    return null;
  }

  const { title, preview: PreviewComponent, inspired } = component;

  return (
    <PreviewModal
      isOpen={true}
      onClose={() => router.back()}
      component={PreviewComponent}
      title={title}
      inspired={inspired}
      isIntercepted={true}
    />
  );
}
