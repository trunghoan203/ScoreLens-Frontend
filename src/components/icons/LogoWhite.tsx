import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ScoreLensLogoProps {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  className?: string;
}

export function ScoreLensLogo({ href = '/', onClick, className }: ScoreLensLogoProps) {
  const logoImg = (
    <Image
      src="/images/logoScoreLensWhite.png"
      alt="ScoreLens Logo"
      width={160}
      height={40}
      priority
      onClick={onClick}
      className={`w-32 sm:w-36 md:w-40 ${className || ''}`}
      style={{ cursor: onClick || href ? 'pointer' : 'default' }}
    />
  );
  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoImg}
      </Link>
    );
  }
  return logoImg;
} 