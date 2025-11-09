// components/VideoPlayerSmart.tsx

/**
 * VideoPlayerSmart
 *
 * Lazily displays a preview video after a small delay to improve LCP.
 * Attempts to autoplay muted — if blocked, the user can manually start playback.
 */

"use client";

import { useEffect, useRef, useState, type JSX } from "react";

export default function VideoPlayerSmart(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Displays video slightly later to improve LCP and attempts autoplay.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);

      const el = videoRef.current;
      if (!el) return;

      el.muted = true;
      el.playsInline = true;
      el.autoplay = true;

      el.play().catch((err) => {
        // Autoplay is often blocked on mobile + desktop
        console.warn("Autoplay blocked:", err);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section
      aria-labelledby="shortly-video-title"
      className="px-4 py-12 bg-white dark:bg-zinc-900"
    >
      <h1
        id="shortly-video-title"
        className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-white"
      >
        See Shortly in Action
      </h1>

      <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-lg shadow-lg">
        {isVisible && (
          <video
            ref={videoRef}
            loop
            muted
            autoPlay
            playsInline
            preload="metadata"
            controls
            controlsList="nodownload"
            poster="/videos/shortlycovermaindark.png"
            className="h-full w-full rounded-lg object-cover"
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
