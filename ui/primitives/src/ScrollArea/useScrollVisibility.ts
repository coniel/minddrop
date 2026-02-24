import { useCallback, useRef } from 'react';
import type { ScrollAreaVisibility } from './ScrollArea';

const FADE_DELAY_MS = 1500; // matches macOS scroll indicator hide delay

/*
 * useScrollVisibility
 * Manages the is-scrolling class for visibility="scroll" mode.
 * Attach rootRef to the scroll area root element.
 * Pass handleScroll to the viewport's onScroll handler.
 */
export function useScrollVisibility(
  visibility: ScrollAreaVisibility,
  externalRef?: React.Ref<HTMLDivElement>,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (typeof externalRef === 'function') externalRef(el);
      else if (externalRef)
        (externalRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el;
    },
    [externalRef],
  );

  const handleScroll = useCallback(() => {
    if (visibility !== 'scroll') return;
    const el = rootRef.current;
    if (!el) return;

    el.classList.add('is-scrolling');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      el.classList.remove('is-scrolling');
    }, FADE_DELAY_MS);
  }, [visibility]);

  return { setRef, handleScroll };
}
