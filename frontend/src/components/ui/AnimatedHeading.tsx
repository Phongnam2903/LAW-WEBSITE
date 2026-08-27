"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const CHAR_DELAY_MS = 30;
const INITIAL_DELAY_MS = 200;
const CHAR_TRANSITION_MS = 500;
const NBSP = " ";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const lines = text.split("\n");

  return (
    <h1 className={className} style={{ letterSpacing: "-0.04em" }}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block whitespace-nowrap">
          {line.split("").map((char, charIndex) => {
            const delay =
              INITIAL_DELAY_MS + lineIndex * line.length * CHAR_DELAY_MS + charIndex * CHAR_DELAY_MS;
            return (
              <span
                key={charIndex}
                className={cn(
                  "inline-block transition-[opacity,transform] ease-out",
                  started ? "translate-x-0 opacity-100" : "-translate-x-[18px] opacity-0"
                )}
                style={{
                  transitionDuration: `${CHAR_TRANSITION_MS}ms`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {char === " " ? NBSP : char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
