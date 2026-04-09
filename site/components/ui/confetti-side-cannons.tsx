"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type ConfettiSideCannonsProps = {
  active: boolean;
};

export function ConfettiSideCannons({ active }: ConfettiSideCannonsProps) {
  useEffect(() => {
    if (!active) return;

    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    let animationFrameId = 0;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      animationFrameId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [active]);

  return null;
}
