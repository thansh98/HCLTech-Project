import React from 'react';
import { Link } from 'react-router-dom';
import iconAsset from '../../assets/branding/greengrid-icon.png';
import logoAsset from '../../assets/branding/greengrid-logo.png';
import logoDarkAsset from '../../assets/branding/greengrid-logo-dark.png';

export default function BrandLogo({
  variant = 'horizontal', // 'mark' | 'horizontal' | 'full'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  to = '/',
  className = '',
  clickable = true,
  forceDark = false,
}) {
  const sizeMap = {
    sm: { img: 'h-8 sm:h-9', mark: 'w-7 h-7' },
    md: { img: 'h-11 sm:h-12', mark: 'w-9 h-9' },
    lg: { img: 'h-14 sm:h-16', mark: 'w-12 h-12' },
    xl: { img: 'h-20 sm:h-24', mark: 'w-16 h-16' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  let content;
  if (variant === 'mark') {
    content = (
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.mark} ${className}`}>
        <img
          src={iconAsset}
          alt="GreenGrid Mark"
          className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]"
        />
      </div>
    );
  } else if (forceDark) {
    // When inside permanently dark navbar/footer, always render the crisp dark mode logo (white text)
    content = (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoDarkAsset}
          alt="GreenGrid - Smart Energy Management"
          className={`${currentSize.img} w-auto object-contain drop-shadow-[0_2px_10px_rgba(16,185,129,0.25)]`}
        />
      </div>
    );
  } else {
    // Theme-responsive logo (Light mode: dark text, Dark mode: white text)
    content = (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {/* Light Mode Logo */}
        <img
          src={logoAsset}
          alt="GreenGrid - Smart Energy Management"
          className={`${currentSize.img} w-auto object-contain dark:hidden`}
        />
        {/* Dark Mode Logo */}
        <img
          src={logoDarkAsset}
          alt="GreenGrid - Smart Energy Management"
          className={`${currentSize.img} w-auto object-contain hidden dark:block drop-shadow-[0_2px_10px_rgba(16,185,129,0.25)]`}
        />
      </div>
    );
  }

  if (clickable && to) {
    return (
      <Link to={to} className="inline-flex transition-transform hover:scale-[1.02] focus:outline-none shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
