import React, { useEffect, useRef } from "react";

/**
 * UI Kit - tek dosya
 * - GlobalUIKitStyles: injects CSS variables + global utility styles
 * - Button, IconButton, Input, Textarea, Card, FAB
 * - Hooks: useRipple
 *
 * Kullanım:
 * 1) pages/_app.tsx içinde <GlobalUIKitStyles /> ekleyin.
 * 2) Bileşenleri import edip kullanın:
 *    import { Button, Input, Card } from "../components/UIkit";
 *    <Button variant="primary" onClick={...}>Servis Talebi</Button>
 */

/* ----------------------
   Global style component
   ---------------------- */
export function GlobalUIKitStyles() {
  return (
    <style jsx global>{`
      :root {
        --color-bg-start: #f6fff7;
        --color-bg-end: #ffffff;
        --color-neon: #25d366;
        --color-accent: #aaffc3;
        --color-text: #0F1724;
        --color-muted: #6b7280;
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 18px;
        --shadow-soft: 0 10px 30px rgba(15,23,36,0.06);
        --shadow-neon: 0 8px 26px rgba(37,211,102,0.10);
        --space-xxs: 4px;
        --space-xs: 8px;
        --space-sm: 12px;
        --space-md: 18px;
        --space-lg: 28px;
        --max-content-width: 1100px;
        --font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        --type-scale-1: 0.85rem;
        --type-scale-2: 1rem;
        --type-scale-3: 1.25rem;
        --type-scale-4: 1.6rem;
        --type-scale-5: 2.4rem;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body, #__next { height: 100%; }
      body {
        margin: 0;
        font-family: var(--font-family);
        background: linear-gradient(180deg, var(--color-bg-start), var(--color-bg-end));
        color: var(--color-text);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.45;
      }
      .container {
        max-width: var(--max-content-width);
        margin: 0 auto;
        padding: 24px;
      }

      .visually-hidden { position: absolute !important; height: 1px; width: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px); white-space: nowrap; }
      .row { display:flex; gap: var(--space-md); align-items:center; }
      .col { display:flex; flex-direction:column; gap: var(--space-sm); }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-weight: 700;
        transition: transform 160ms cubic-bezier(.2,.9,.2,1), box-shadow 160ms ease, opacity 160ms ease;
        will-change: transform;
        -webkit-tap-highlight-color: transparent;
        position: relative;
        overflow: hidden;
        z-index: 0;
      }
      .btn:active { transform: translateY(1px) scale(0.997); }
      .btn:focus { outline: 3px solid rgba(37,211,102,0.18); outline-offset: 3px; }

      .btn--primary {
        background: linear-gradient(90deg, var(--color-neon), var(--color-accent));
        color: var(--color-text);
        box-shadow: var(--shadow-neon);
      }
      .btn--ghost {
        background: transparent;
        color: var(--color-text);
        border: 1px solid rgba(15,23,36,0.06);
      }
      .btn--small { padding: 8px 12px; border-radius: var(--radius-sm); font-weight:700; }

      @media (hover: hover) and (pointer: fine) {
        .btn:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 14px 40px rgba(16,24,40,0.08); }
        .card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(16,24,40,0.08); }
      }

      .card {
        background: #fff;
        border-radius: var(--radius-lg);
        padding: var(--space-md);
        box-shadow: var(--shadow-soft);
        transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms ease;
      }

      .fab {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, var(--color-neon), var(--color-accent));
        box-shadow: 0 10px 30px rgba(37,211,102,0.14);
        border: none;
        cursor: pointer;
        z-index: 1200;
        transition: transform 160ms ease, box-shadow 160ms ease;
      }
      .fab:focus { outline: 3px solid rgba(37,211,102,0.18); outline-offset: 3px; }

      .form-control {
        width: 100%;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(14, 165, 85, 0.06);
        background: #fff;
        transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
      }
      .form-control:focus {
        box-shadow: 0 8px 26px rgba(37,211,102,0.08);
        border-color: rgba(37,211,102,0.28);
        outline: none;
        transform: translateY(-2px);
      }

      .ripple-container { position: relative; overflow: hidden; border-radius: inherit; }

      @media (prefers-reduced-motion: reduce) {
        .btn, .card, .fab, .form-control { transition: none !important; transform: none !important; }
      }

      @media (max-width: 900px) {
        .container { padding: 16px; }
      }
    `}</style>
  );
}

/* ----------------------
   Helper: create ripple
   ---------------------- */
function createRipple(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height) * 1.2;
  const x = clientX - rect.left - size / 2;
  const y = clientY - rect.top - size / 2;
  ripple.style.position = "absolute";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(15,23,36,0.06)";
  ripple.style.transform = "scale(0.2)";
  ripple.style.opacity = "0.9";
  ripple.style.pointerEvents = "none";
  ripple.style.transition = "transform 520ms cubic-bezier(.2,.9,.2,1), opacity 520ms ease";
  el.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.style.transform = "scale(1)";
    ripple.style.opacity = "0";
  });
  setTimeout(() => ripple.remove(), 650);
}

/* ----------------------
   Hook: useRipple
   ---------------------- */
export function useRipple<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePointerDown = (e: PointerEvent) => {
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      createRipple(el as HTMLElement, e.clientX, e.clientY);
    };
    el.addEventListener("pointerdown", handlePointerDown);
    return () => el.removeEventListener("pointerdown", handlePointerDown);
  }, []);
  return ref;
}

/* ----------------------
   Components
   ---------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "normal" | "small";
};
export function Button({ variant = "primary", size = "normal", children, ...rest }: ButtonProps) {
  const ref = useRipple<HTMLButtonElement>();
  const classNames = ["btn", variant === "primary" ? "btn--primary" : "btn--ghost", size === "small" ? "btn--small" : ""].join(" ");
  return (
    <button ref={ref as any} className={classNames} {...rest}>
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
    </button>
  );
}

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string };
export function IconButton({ label, children, ...rest }: IconButtonProps) {
  return (
    <button aria-label={label} className="btn btn--ghost btn--small" {...rest} style={{ padding: 8, borderRadius: 10 }}>
      {children}
    </button>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function Input(props: InputProps) {
  return <input className="form-control" {...props} />;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea(props: TextareaProps) {
  return <textarea className="form-control" rows={3} {...props} />;
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

type FABProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel?: string };
export function FAB({ ariaLabel = "Servis Botu", children, ...rest }: FABProps) {
  return (
    <button className="fab" aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  );
}

const UIkit = {
  GlobalUIKitStyles,
  Button,
  IconButton,
  Input,
  Textarea,
  Card,
  FAB,
  useRipple,
};
export default UIkit;