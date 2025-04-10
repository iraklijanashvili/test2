import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type OptimizedImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // თუ აუცილებელია სურათის ნაადრევი ჩატვირთვა (მაგ: hero სურათები)
  onLoad?: () => void;
  blurDataURL?: string; // პლეისჰოლდერი ჩატვირთვისას (base64 კოდირებულ სურათი)
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  objectFit = 'cover',
  priority = false,
  onLoad,
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // ლეიზი ლოადინგისთვის
  useEffect(() => {
    // თუ სურათი პრიორიტეტულია, არ ვიყენებთ ლეიზი ლოადინგს
    if (priority) return;
    
    // IntersectionObserver API-ის გამოყენება სურათების lazy loading-ისთვის
    const imgElement = document.querySelector(`[data-src="${src}"]`) as HTMLImageElement;
    if (!imgElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          const dataSrc = lazyImage.getAttribute('data-src');
          
          if (dataSrc) {
            lazyImage.src = dataSrc;
            observer.unobserve(lazyImage);
          }
        }
      });
    }, { rootMargin: '100px' });

    observer.observe(imgElement);

    return () => {
      if (imgElement) observer.unobserve(imgElement);
    };
  }, [src, priority]);

  const handleImageLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setError(true);
  };

  const imageStyle = {
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    objectFit
  };

  const placeholderStyle = {
    backgroundColor: '#f3f4f6',
    backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {!loaded && !error && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
        />
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
      <img
        src={priority ? src : ''}
        data-src={!priority ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn('w-full h-full', error ? 'hidden' : '')}
        style={imageStyle as React.CSSProperties}
        {...props}
      />
    </div>
  );
} 