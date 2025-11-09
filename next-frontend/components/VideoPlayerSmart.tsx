//next-frontend\components\VideoPlayerSmart.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPlayerSmart() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowVideo(true);

      const video = videoRef.current;
      if (video) {
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        video.play().catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
      }
    }, 500); // Slight delay to improve LCP

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="px-4 py-12 bg-white dark:bg-zinc-900">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        See Shortly in Action
      </h1>

      <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden aspect-[16/9]">
        {showVideo && (
          <video
            ref={videoRef}
            loop
            muted
            autoPlay
            playsInline
            preload="metadata"
            controls
            poster="/videos/shortlycovermaindark.png"
            controlsList="nodownload"
            className="w-full h-full rounded-lg object-cover"
          >
            <source src="/videos/Shortly.webm" type="video/webm" />
            <source src="/videos/Shortly_small.mp4" type="video/mp4" />
            <source src="/videos/Shortly.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
}

