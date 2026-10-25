import confetti from 'canvas-confetti';

// Vivid color palettes for educational math celebration
const PALETTES = {
  rainbow: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#e11d48'],
  goldStars: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff', '#ca8a04'],
  fire: ['#ef4444', '#f97316', '#f59e0b', '#fbbf24', '#dc2626'],
  emeraldSuccess: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#f59e0b', '#3b82f6'],
};

/**
 * Triggers a massive, multi-second celebratory fireworks display for Module Completion.
 * Alternating side cannons + high-altitude bursts + star showers.
 */
export function triggerModuleCompleteCelebration(durationMs: number = 3200): void {
  try {
    const end = Date.now() + durationMs;

    // 1. Immediate punchy center burst
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: PALETTES.emeraldSuccess,
      shapes: ['square', 'circle', 'star'],
      zIndex: 9999,
    });

    // 2. High star fountain from center
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 70,
      startVelocity: 55,
      origin: { x: 0.5, y: 0.7 },
      colors: PALETTES.goldStars,
      shapes: ['star'],
      scalar: 1.3,
      zIndex: 9999,
    });

    // 3. Sustained side cannon volleys
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Left cannon shooting up and to the right
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        startVelocity: 50,
        origin: { x: 0, y: 0.75 },
        colors: PALETTES.rainbow,
        shapes: ['circle', 'square'],
        zIndex: 9999,
      });

      // Right cannon shooting up and to the left
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        startVelocity: 50,
        origin: { x: 1, y: 0.75 },
        colors: PALETTES.rainbow,
        shapes: ['circle', 'square'],
        zIndex: 9999,
      });

      // Random floating glitter star in upper sky
      if (Math.random() > 0.4) {
        confetti({
          particleCount: 15,
          angle: 90,
          spread: 360,
          startVelocity: 30,
          origin: {
            x: 0.2 + Math.random() * 0.6,
            y: 0.15 + Math.random() * 0.35,
          },
          colors: PALETTES.goldStars,
          shapes: ['star'],
          scalar: 1.1,
          zIndex: 9999,
        });
      }
    }, 250);
  } catch (err) {
    console.error('Failed to trigger module confetti celebration:', err);
  }
}

/**
 * Triggers a prestigious Level-Up celebration with golden crowns, sparkling stars,
 * and high-velocity firework blasts.
 */
export function triggerLevelUpCelebration(durationMs: number = 3000): void {
  try {
    const end = Date.now() + durationMs;

    // Initial golden nova
    confetti({
      particleCount: 100,
      spread: 90,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.55 },
      colors: PALETTES.goldStars,
      shapes: ['star'],
      scalar: 1.4,
      zIndex: 9999,
    });

    // Alternating fireworks across the top
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 40 * (timeLeft / durationMs);

      // Random coordinate firework
      confetti({
        particleCount: Math.max(15, Math.floor(particleCount)),
        angle: 90,
        spread: 80,
        startVelocity: 45,
        origin: {
          x: 0.15 + Math.random() * 0.7,
          y: 0.3 + Math.random() * 0.3,
        },
        colors: Math.random() > 0.5 ? PALETTES.goldStars : PALETTES.rainbow,
        shapes: ['star', 'circle'],
        zIndex: 9999,
      });

      // Bottom burst
      confetti({
        particleCount: 20,
        angle: 90,
        spread: 60,
        startVelocity: 40,
        origin: { x: 0.5, y: 0.8 },
        colors: PALETTES.goldStars,
        shapes: ['star'],
        scalar: 1.2,
        zIndex: 9999,
      });
    }, 320);
  } catch (err) {
    console.error('Failed to trigger level up confetti celebration:', err);
  }
}

/**
 * Streak milestone fiery blast
 */
export function triggerStreakCelebration(): void {
  try {
    confetti({
      particleCount: 75,
      angle: 90,
      spread: 60,
      startVelocity: 50,
      origin: { x: 0.5, y: 0.65 },
      colors: PALETTES.fire,
      shapes: ['square', 'circle'],
      zIndex: 9999,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 90,
        spread: 45,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.65 },
        colors: ['#ffffff', '#fbbf24', '#f97316'],
        shapes: ['star'],
        scalar: 1.2,
        zIndex: 9999,
      });
    }, 150);
  } catch (err) {
    console.error('Failed to trigger streak celebration:', err);
  }
}

/**
 * Trophy/Badge unlock sparkle shower
 */
export function triggerBadgeCelebration(): void {
  try {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors: PALETTES.goldStars,
      shapes: ['star'],
      scalar: 1.3,
      zIndex: 9999,
    });

    confetti({
      particleCount: 50,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      colors: PALETTES.rainbow,
      shapes: ['circle', 'square'],
      zIndex: 9999,
    });
  } catch (err) {
    console.error('Failed to trigger badge celebration:', err);
  }
}

/**
 * Quick instant burst for correct answer feedback or button click
 */
export function triggerQuickBurst(originX: number = 0.5, originY: number = 0.6): void {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: PALETTES.rainbow,
      shapes: ['circle', 'square'],
      zIndex: 9999,
    });
  } catch (err) {
    console.error('Failed to trigger quick confetti burst:', err);
  }
}
