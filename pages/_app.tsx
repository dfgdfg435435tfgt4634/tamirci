import type { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";
import "../styles/globals.css";
import UIkit from "../components/UIkit";
import WhatsAppFAB from "../components/WhatsAppFAB";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [animEnabled, setAnimEnabled] = useState(false);

  useEffect(() => {
    const mqReduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mqMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 800px)").matches;
    setAnimEnabled(!mqReduce && !mqMobile);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      if (!animEnabled || !overlayRef.current) return;
      const el = overlayRef.current;
      el.style.display = "block";
      import("gsap").then(({ gsap }) => {
        gsap.killTweensOf(el);
        gsap.set(el, { transformPerspective: 1200, rotateY: -25, opacity: 0, scale: 0.85 });
        gsap.to(el, { duration: 0.45, rotateY: 0, opacity: 1, scale: 1, ease: "power3.out" });
      });
    };
    const handleComplete = () => {
      if (!animEnabled || !overlayRef.current) return;
      const el = overlayRef.current;
      import("gsap").then(({ gsap }) => {
        gsap.to(el, {
          duration: 0.5,
          rotateY: 25,
          opacity: 0,
          scale: 0.95,
          ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
            gsap.set(el, { clearProps: "transform,opacity" });
          },
        });
      });
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events, animEnabled]);

  return (
    <>
      <UIkit.GlobalUIKitStyles />
      <div ref={overlayRef} className="page-overlay" aria-hidden />
      <Component {...pageProps} />
      <WhatsAppFAB />
      <style jsx>{`
        .page-overlay {
          position: fixed;
          inset: 0;
          display: none;
          z-index: 9999;
          background: linear-gradient(135deg, rgba(37,211,102,0.06), rgba(170,255,195,0.06));
          backdrop-filter: blur(6px) saturate(120%);
          pointer-events: none;
        }
      `}</style>
    </>
  );
}