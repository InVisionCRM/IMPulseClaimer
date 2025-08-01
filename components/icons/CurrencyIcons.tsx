import React from 'react'

export interface IconProps {
  size?: number;
  className?: string;
}

export const EthereumIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#627EEA"/>
    <path d="M2 17L12 22L22 17" fill="#627EEA"/>
    <path d="M2 12L12 17L22 12" fill="#627EEA"/>
  </svg>
);

export const PulseChainIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#8247E5"/>
    <path d="M7 12L10 9L13 12L10 15L7 12Z" fill="white"/>
    <path d="M11 12L14 9L17 12L14 15L11 12Z" fill="white"/>
  </svg>
);

export const BNBIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L14.09 8.26L22 9L14.09 9.74L12 16L9.91 9.74L2 9L9.91 8.26L12 2Z" fill="#F3BA2F"/>
  </svg>
);

export const PolygonIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8247E5"/>
    <path d="M2 17L12 22L22 17" fill="#8247E5"/>
    <path d="M2 12L12 17L22 12" fill="#8247E5"/>
  </svg>
);

export const ArbitrumIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#28A0F0"/>
    <path d="M2 17L12 22L22 17" fill="#28A0F0"/>
    <path d="M2 12L12 17L22 12" fill="#28A0F0"/>
  </svg>
);

export const AvalancheIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#E84142"/>
    <path d="M2 17L12 22L22 17" fill="#E84142"/>
    <path d="M2 12L12 17L22 12" fill="#E84142"/>
  </svg>
);

export const BaseIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0052FF"/>
    <path d="M2 17L12 22L22 17" fill="#0052FF"/>
    <path d="M2 12L12 17L22 12" fill="#0052FF"/>
  </svg>
);

export const TimeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#F59E0B"/>
    <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
); 