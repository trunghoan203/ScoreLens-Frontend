import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ScoreLensLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image 
        src="/images/logoScoreLensBlack.png" 
        alt="ScoreLens Logo" 
        width={160} 
        height={40} 
        priority 
      />
    </Link>
  );
} 