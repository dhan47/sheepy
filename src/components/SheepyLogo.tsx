import image_735942044b0de77a9db0babbc9b2e99a6c31e6be from 'figma:asset/735942044b0de77a9db0babbc9b2e99a6c31e6be.png';
import svgPaths from "../imports/svg-k1bkmald5a";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SheepyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function SheepyLogo({ size = 'medium', showText = true }: SheepyLogoProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-3">
      {/* Sheepy Character */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <ImageWithFallback 
          src={image_735942044b0de77a9db0babbc9b2e99a6c31e6be}
          alt="Sheepy Bible Logo"
          className="w-full h-full object-contain rounded-[31px] shadow-lg"
        />
      </div>

      {/* Text Logo */}
      {showText && (
        <div className="relative">
          <svg className={`${sizeClasses[size]} ${textSizeClasses[size]}`} fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 657 181">
            <g>
              <path d={svgPaths.p228c40c0} fill="#0D2A72" />
              <path d={svgPaths.p3dc7c180} fill="#0D2A72" />
              <path d={svgPaths.p2178c800} fill="#0D2A72" />
              <path d={svgPaths.p175f0380} fill="#0D2A72" />
              <path d={svgPaths.p3a67f100} fill="#0D2A72" />
              <path d={svgPaths.p11e5f100} fill="#0D2A72" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}