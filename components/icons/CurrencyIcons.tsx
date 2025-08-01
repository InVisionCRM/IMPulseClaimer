import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

export const TimeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="20" cy="20" r="20" fill="#FBBF24" />
    <path
      d="M20 10V20L27 23.5"
      stroke="#131313"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EthereumIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 31.9999L15.5227 31.3652V17.0165L16 16.514L24.4773 21.0357L16 31.9999Z" fill="#71717A"/>
    <path d="M16 31.9999L7.52273 21.0357L16 16.514V31.9999Z" fill="#A1A1AA"/>
    <path d="M16 14.803L15.5682 15.203V0.00388336L16 -0.00012207L24.483 11.758L16 14.803Z" fill="#71717A"/>
    <path d="M16 -0.00012207L7.51705 11.758L16 14.803V-0.00012207Z" fill="#A1A1AA"/>
    <path d="M16 29.809L24.4773 21.0357L16 16.514V29.809Z" fill="#404040"/>
    <path d="M7.52273 21.0357L16 29.809V16.514L7.52273 21.0357Z" fill="#71717A"/>
  </svg>
);

export const BaseIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#0052FF"/>
        <path d="M9 13.4839H23V15.7419H9V13.4839Z" fill="white"/>
        <path d="M9 17.2258H23V19.4839H9V17.2258Z" fill="white"/>
    </svg>
);

export const BNBIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#F0B90B"/>
        <path d="M16 9.5L12 12.5L16 15.5L20 12.5L16 9.5Z" fill="#0B0E11"/>
        <path d="M12.5 16L9.5 19L12.5 22L15.5 19L12.5 16Z" fill="#0B0E11"/>
        <path d="M19.5 16L16.5 19L19.5 22L22.5 19L19.5 16Z" fill="#0B0E11"/>
        <path d="M16 22.5L12 19.5L16 16.5L20 19.5L16 22.5Z" fill="#0B0E11"/>
        <path d="M8 12.5L11 15.5V9.5L8 12.5Z" fill="#0B0E11"/>
        <path d="M24 12.5L21 9.5V15.5L24 12.5Z" fill="#0B0E11"/>
    </svg>
);

export const PolygonIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#8247E5"/>
        <path d="M11.666 12.5455L16.3327 9.63635L21.0004 12.5455V18.3636L16.3327 21.2727L11.666 18.3636V12.5455Z" stroke="white" strokeWidth="1.5"/>
        <path d="M14.25 11.2727L18.9167 14.1818L14.25 17.0909L9.58301 14.1818L14.25 11.2727Z" stroke="white" strokeWidth="1.5"/>
    </svg>
);

export const ArbitrumIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#2D374B"/>
        <path d="M23 11.8333L16.5 8L10 11.8333L16.5 15.6667L23 11.8333Z" fill="#28A0F0"/>
        <path d="M10 12.8333V20L16.5 24L23 20V12.8333L16.5 16.6667L10 12.8333Z" fill="#28A0F0"/>
    </svg>
);

export const AvalancheIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#E84142"/>
        <path d="M11.293 23.9999L18.4147 8.99988H21.571L14.451 23.9999H11.293Z" fill="white"/>
        <path d="M8 23.9999L11.8541 15.8234L13.7847 19.9116L10.027 23.9999H8Z" fill="white"/>
    </svg>
);

export const PulseChainIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="#A100F2"/>
        <path d="M13.5 10H18C20.4853 10 22.5 12.0147 22.5 14.5C22.5 16.9853 20.4853 19 18 19H13.5V10Z" fill="white"/>
        <path d="M13.5 10V22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);