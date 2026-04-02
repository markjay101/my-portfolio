"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

const CLAMP_PX = 50;
const MIN_CHARS = 100;
const P = "text-sm leading-relaxed text-foreground/90";
const EASE =
  "transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

export function ExperienceDescription({ text }: { text: string }) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [fullH, setFullH] = useState(0);
  const [open, setOpen] = useState(false);
  const regionId = `${useId()}-desc`;
  const expandable = text.trim().length > MIN_CHARS;

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || !expandable) return;
    const measure = () => setFullH(el.scrollHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expandable]);

  if (!expandable) {
    return <p className={`mt-3 ${P}`}>{text}</p>;
  }

  const collapsed = fullH > 0 ? Math.min(fullH, CLAMP_PX) : CLAMP_PX;

  return (
    <div className="mt-3">
      <div
        id={regionId}
        className={`overflow-hidden ${fullH ? EASE : ""}`}
        style={{ maxHeight: fullH > 0 ? (open ? fullH : collapsed) : CLAMP_PX }}
      >
        <p ref={contentRef} className={P}>
          {text}
        </p>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((o) => !o)}
        className="mt-2 text-xs font-medium text-accent transition-opacity duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? "See less" : "See more"}
      </button>
    </div>
  );
}
