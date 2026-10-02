'use client';

import { useState, useCallback, useRef } from "react";

export function useInView(threshold = 0.12) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        setInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold]
  );

  // Attach .current for compatibility with RefObject callers
  Object.defineProperty(ref, 'current', {
    get: () => nodeRef.current,
    set: (val: HTMLDivElement | null) => {
      ref(val);
    },
    configurable: true,
  });

  return { ref: ref as unknown as React.RefObject<HTMLDivElement>, inView };
}

