import React from 'react';
import { TimeSelector } from '@/components/LikedComponents/TimeSelector';
import HouseAnimatedButton from '@/components/LikedComponents/HouseButton';
import WorkflowAnimation from '@/components/LikedComponents/Workflow';
import { PeopleAccordion } from '@/components/LikedComponents/PeopleAccordion';

export interface LikedComponent {
  id: number;
  title: string;
  description: string;
  tags?: string[];
  preview: React.ComponentType;
  inspired?: string | null;
  span?: string;
  isMobile?: boolean;
}

export const likedComponents: LikedComponent[] = [
    {
      id: 1,
      title: "Time Selector",
      description: "Custom time selection component",
      preview: TimeSelector,
      inspired: "https://x.com/proskuaaa/status/1901890724452311188",
      span: "col-span-10 xs:col-span-12 md:col-span-8 lg:col-span-8"
    },
    {
      id: 2,
      title: "Animated House Button",
      description: "Animated house button with framer motion",
      preview: HouseAnimatedButton,
      inspired: "https://x.com/markoilico/status/1897422797712015516",
      span: "col-span-10 xs:col-span-12 md:col-span-4 lg:col-span-4"
    },
    {
      id: 3,
      title: "Workflow Animation",
      description: "Animated workflow trigger component",
      preview: WorkflowAnimation,
      inspired: null,
      span: "col-span-10 xs:col-span-12 md:col-span-6 lg:col-span-6"
    },
    {
      id: 4,
      title: "Accordion",
      description: "Custom accordion component",
      preview: PeopleAccordion,
      inspired: null,
      span: "col-span-10 xs:col-span-12 md:col-span-6 lg:col-span-6"
    },
  ];