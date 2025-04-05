import React from 'react';
import { Dialog } from '@headlessui/react';
import { FiX, FiExternalLink } from 'react-icons/fi';

interface CodeFile {
  name: string;
  content: string;
  language: string;
  type: 'component' | 'related';
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: React.ComponentType;
  title: string;
  inspired?: string | null;
  files?: CodeFile[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  component: Component,
  title,
  inspired,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl bg-[#1d1d1d] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-0">
            <Dialog.Title className="text-xl font-medium text-white flex items-center gap-2">
              {title}
              {inspired && (
                <a
                  href={inspired}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-gray-400 hover:text-[#dfff1f]"
                  aria-label="View inspiration source"
                >
                  <FiExternalLink size={16} />
                </a>
              )}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              aria-label="Close preview"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex h-[60vh] md:h-[600px]">
            <div className="p-4 md:p-6 flex items-center justify-center w-full">
              <div className="w-full h-full flex items-center justify-center bg-[#2d2d2d] rounded-xl overflow-hidden">
                <div className="w-full h-full max-w-full max-h-full overflow-hidden items-center justify-center flex">
                  <Component />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};