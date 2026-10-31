"use client";
import { useEffect, useRef, useState } from "react";
export function useScrollHeader(locked = false) {
  const [hidden, setHidden] = useState(false),
    ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let last = window.scrollY,
      anchor = last,
      frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY,
        focused = ref.current?.contains(document.activeElement);
      if (locked || focused || y < 80) {
        setHidden(false);
        anchor = y;
      } else if (Math.abs(y - anchor) > 18) {
        setHidden(y > last);
        anchor = y;
      }
      last = y;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const focus = () => setHidden(false);
    window.addEventListener("scroll", scroll, { passive: true });
    ref.current?.addEventListener("focusin", focus);
    const el = ref.current;
    if (locked) setHidden(false);
    return () => {
      window.removeEventListener("scroll", scroll);
      el?.removeEventListener("focusin", focus);
      cancelAnimationFrame(frame);
    };
  }, [locked]);
  return { ref, hidden };
}
