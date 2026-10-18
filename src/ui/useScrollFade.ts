import { useEffect, useState } from 'react';

/**
 * Drives the Finous-style scroll story: the tint behind the hero fades out as the
 * page scrolls (written to --bd-fade on the document) and a slim bar takes over.
 * With reduced motion the tint still changes, it just does not animate.
 */
export function useScrollFade(fadeDistance = 220, slimAt = 260) {
  const [slim, setSlim] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      root.style.setProperty('--bd-fade', String(Math.max(0, 1 - y / fadeDistance)));
      setSlim(y > slimAt);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty('--bd-fade');
    };
  }, [fadeDistance, slimAt]);

  return { slim };
}
