"use client";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
}: ScrollFadeInProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${isVisible ? "visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
