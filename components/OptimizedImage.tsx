"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  loadingType?: 'lazy' | 'eager';
  showLoader?: boolean;
  errorFallback?: React.ReactNode;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  loadingType = 'lazy',
  showLoader = true,
  errorFallback,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const ErrorFallback = () => (
    errorFallback || (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">فشل في تحميل الصورة</div>
        </div>
      </div>
    )
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && showLoader && <LoadingSpinner />}
      {hasError && imageSrc === fallbackSrc ? (
        <ErrorFallback />
      ) : (
        <Image
          {...props}
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${props.className || ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loadingType}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
    </div>
  );
}

// Hook for progressive image loading
export function useProgressiveImage(src: string, placeholder?: string) {
  const [imgSrc, setImgSrc] = React.useState(placeholder || src);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return { src: imgSrc, isLoading };
}

// Component for responsive images with multiple sizes
interface ResponsiveImageProps extends OptimizedImageProps {
  sizes?: string;
  srcSet?: string;
}

export function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: ResponsiveImageProps) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      sizes={sizes}
      style={{
        width: '100%',
        height: 'auto',
        ...props.style,
      }}
    />
  );
}

// Component for hero images with optimized loading
export function HeroImage({
  src,
  alt,
  priority = true,
  ...props
}: OptimizedImageProps & { priority?: boolean }) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      loadingType={priority ? 'eager' : 'lazy'}
      priority={priority}
      sizes="100vw"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...props.style,
      }}
    />
  );
}
