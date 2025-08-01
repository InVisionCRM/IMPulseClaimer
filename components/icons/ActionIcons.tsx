
import React from 'react';

interface IconProps {
  className?: string;
}

export const GitlabIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
      className={className || 'w-6 h-6'} 
      viewBox="0 0 36 36" 
      xmlns="http://www.w3.org/2000/svg">
      <path 
        fill="currentColor"
        d="M34.43 17.66L30.2 5.72a.5.5 0 0 0-.94-.04L25.24 17.5H10.76L6.74 5.68a.5.5 0 0 0-.94.04L1.57 17.66a.4.4 0 0 0 .16.51l16.1 7.76a.6.6 0 0 0 .33 0l16.1-7.76a.4.4 0 0 0 .17-.51z">
      </path>
    </svg>
);
