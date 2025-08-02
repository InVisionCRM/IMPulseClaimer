import React from 'react'
import Image from 'next/image'

interface TimeTokenDisplayProps {
  size?: number;
  className?: string;
}

const TimeTokenDisplay: React.FC<TimeTokenDisplayProps> = ({ size = 24, className = '' }) => {
  return (
    <Image
      src="/crypto_logos_/TIME-2d-500.png"
      alt="TIME Token"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default TimeTokenDisplay; 