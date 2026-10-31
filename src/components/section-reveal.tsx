"use client";
import { useEffect, useRef } from "react";
export default function SectionReveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            node.animate(
              [
                { transform: "translateY(16px)", opacity: 0.75 },
                { transform: "translateY(0)", opacity: 1 },
              ],
              { duration: 550, easing: "cubic-bezier(.22,1,.36,1)" },
            );
            observer.unobserve(node);
          }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
