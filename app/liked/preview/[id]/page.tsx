"use client";

import { useParams, useRouter } from 'next/navigation';

import { PreviewModal } from '@/components/LikedComponents/PreviewModal';
import { likedComponents } from '@/data/likedComponents';

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const component = likedComponents.find(comp => comp.id === id);

    if (!component) {
        router.push('/liked');
        return null;
    }

    const { title, preview: PreviewComponent, inspired } = component;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
            <PreviewModal
                isOpen={true}
                onClose={() => router.push('/liked')}
                component={PreviewComponent}
                title={title}
                inspired={inspired}
                isIntercepted={true}
            />
        </div>
    );
}
