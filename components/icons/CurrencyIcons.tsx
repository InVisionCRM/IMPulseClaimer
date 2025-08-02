import React from 'react'
import Image from 'next/image'

export interface IconProps {
  size?: number;
  className?: string;
}

export const EthereumIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/ethereum-eth-logo.svg"
    alt="Ethereum"
    width={size}
    height={size}
    className={className}
  />
);

export const PulseChainIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/pulsechain.svg"
    alt="PulseChain"
    width={size}
    height={size}
    className={className}
  />
);

export const BNBIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/bsc.png"
    alt="BNB Chain"
    width={size}
    height={size}
    className={className}
  />
);

export const PolygonIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/polygon-matic-logo.svg"
    alt="Polygon"
    width={size}
    height={size}
    className={className}
  />
);

export const ArbitrumIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/arbitrum-arb-logo.svg"
    alt="Arbitrum"
    width={size}
    height={size}
    className={className}
  />
);

export const AvalancheIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/avalanche-avax-logo.svg"
    alt="Avalanche"
    width={size}
    height={size}
    className={className}
  />
);

export const BaseIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <Image
    src="/crypto_logos_/Base_id0fomPa2o_0.png"
    alt="Base"
    width={size}
    height={size}
    className={className}
  />
);

 