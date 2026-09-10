import { RefObject, useLayoutEffect } from 'react';
import { resolveGrownHeight } from './resolveGrownHeight';

export interface UseAutoGrowOptions {
  /**
   * Whether the textarea grows with its content.
   */
  enabled?: boolean;

  /**
   * Lines of text the textarea stops growing at, scrolling from
   * there.
   */
  maxRows?: number;

  /**
   * The textarea's current value, which the height is resolved
   * again for as it changes.
   */
  value?: string;
}

// Lines of text a growing textarea stops growing at by default
const DefaultMaxRows = 12;

/**
 * Grows a textarea with its content, up to a number of lines. The
 * height follows the value it is given, and the textarea's own input
 * events where it is uncontrolled.
 *
 * @param ref - Reference to the textarea.
 * @param options - Whether to grow, the line cap, and the value to follow.
 */
export function useAutoGrow(
  ref: RefObject<HTMLElement | null>,
  options: UseAutoGrowOptions = {},
): void {
  const { enabled = true, maxRows = DefaultMaxRows, value } = options;

  // Resize before the paint which would otherwise show the height
  // the previous content had.
  useLayoutEffect(() => {
    const element = ref.current;

    if (!enabled || !(element instanceof HTMLTextAreaElement)) {
      return;
    }

    function resize(): void {
      const textarea = ref.current as HTMLTextAreaElement;

      // Drop the height held for the previous content, so the
      // element reports the height this content needs.
      textarea.style.height = 'auto';
      textarea.style.height = `${resolveGrownHeight(textarea, maxRows)}px`;
    }

    resize();

    // Follow the typing of an uncontrolled textarea, whose value
    // never passes through this hook.
    element.addEventListener('input', resize);

    return () => element.removeEventListener('input', resize);
  }, [ref, enabled, maxRows, value]);
}
