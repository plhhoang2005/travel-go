import { CSSProperties, ReactNode, useRef } from 'react';

type TravelImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  children?: ReactNode;
};

type DepthStyle = CSSProperties & {
  '--image-rx'?: string;
  '--image-ry'?: string;
  '--image-x'?: string;
  '--image-y'?: string;
};

export function TravelImage({ src, alt, className = '', loading = 'lazy', children }: TravelImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const resetDepth = () => {
    const element = rootRef.current;
    if (!element) return;
    element.style.setProperty('--image-rx', '0deg');
    element.style.setProperty('--image-ry', '0deg');
    element.style.setProperty('--image-x', '0px');
    element.style.setProperty('--image-y', '0px');
  };

  return (
    <div
      ref={rootRef}
      className={`travel-image ${className}`}
      style={{ '--image-rx': '0deg', '--image-ry': '0deg', '--image-x': '0px', '--image-y': '0px' } as DepthStyle}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
        const vertical = (event.clientY - rect.top) / rect.height - 0.5;
        event.currentTarget.style.setProperty('--image-rx', `${vertical * -3.5}deg`);
        event.currentTarget.style.setProperty('--image-ry', `${horizontal * 3.5}deg`);
        event.currentTarget.style.setProperty('--image-x', `${horizontal * 4}px`);
        event.currentTarget.style.setProperty('--image-y', `${vertical * 4}px`);
      }}
      onPointerLeave={resetDepth}
    >
      <div className="travel-image-plane">
        <img src={src} alt={alt} loading={loading} />
        {children}
      </div>
    </div>
  );
}
