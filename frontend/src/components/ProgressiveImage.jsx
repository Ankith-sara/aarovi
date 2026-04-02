/**
 * ProgressiveImage
 * ─────────────────
 * Drop-in <img> replacement that:
 *  1. Shows a shimmer skeleton while loading
 *  2. Fades in the image once loaded
 *  3. Auto-injects Cloudinary transforms (f_auto,q_auto,w_<size>) when the
 *     src is a Cloudinary URL — no manual changes needed elsewhere
 *  4. Falls back gracefully on error
 */

import React, { useState, useRef, useEffect } from 'react';

// Cloudinary auto-transform helper
const optimizeCloudinaryUrl = (src, width = 800) => {
  if (!src || typeof src !== 'string') return src;
  if (!src.includes('res.cloudinary.com')) return src;
  // Inject transforms before /upload/
  if (src.includes('/upload/')) {
    return src.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},c_limit/`);
  }
  return src;
};

const ProgressiveImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  width = 800,          // Cloudinary transform width
  loading = 'lazy',
  fetchpriority,
  onLoad,
  onError,
  aspectRatio,          // e.g. '3/4' — sets padding-bottom trick for CLS prevention
  ...rest
}) => {
  const [status, setStatus] = useState('idle'); // idle | loading | loaded | error
  const imgRef = useRef(null);
  const optimizedSrc = optimizeCloudinaryUrl(src, width);

  useEffect(() => {
    if (!optimizedSrc) return;
    setStatus('loading');
    // If already cached the browser fires load instantly
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, [optimizedSrc]);

  const handleLoad = (e) => {
    setStatus('loaded');
    onLoad?.(e);
  };

  const handleError = (e) => {
    setStatus('error');
    onError?.(e);
  };

  const shimmerStyle = {
    background: 'linear-gradient(90deg,#f0ece8 25%,#e8e2dc 50%,#f0ece8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease-in-out infinite',
  };

  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 ${className}`} style={style} {...rest}>
        <span className="text-gray-300 text-2xl">✕</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full" style={aspectRatio ? { aspectRatio } : {}}>
      {/* Shimmer */}
      {status !== 'loaded' && (
        <div className="absolute inset-0" style={shimmerStyle} aria-hidden="true" />
      )}

      {optimizedSrc && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          loading={loading}
          fetchpriority={fetchpriority}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${className}`}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
