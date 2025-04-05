import React from 'react';

interface LoadingFallbackProps {
  height?: string;
  width?: string;
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  height = 'h-full',
  width = 'w-full',
  className = '',
}) => {
  return (
    <div className={`p-4 animate-pulse bg-[#222] rounded-xl ${height} ${width} ${className}`}>
      <div className="h-6 bg-[#333] rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-[#333] rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-[#333] rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-[#333] rounded w-1/3"></div>
    </div>
  );
};

export default LoadingFallback;