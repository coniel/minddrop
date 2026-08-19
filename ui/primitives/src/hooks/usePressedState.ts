import { useCallback, useEffect, useState } from 'react';

export interface PressedState {
  /**
   * Whether the element is currently held down.
   */
  pressed: boolean;

  /**
   * Props spread onto the element to track the press.
   */
  pressedProps: {
    'data-pressed': boolean;
    onPointerDown: () => void;
  };
}

/**
 * Tracks whether an element is being held down, for draggables which
 * cannot use `:active`.
 *
 * Starting a drag swallows the pointer release, so `:active` sticks
 * to the element the drag started from and never clears. Each drag
 * leaves another element looking pressed, and they accumulate until
 * something else is clicked.
 *
 * The release is watched on the document rather than the element,
 * since the element itself never receives it once a drag begins.
 */
export function usePressedState(): PressedState {
  const [pressed, setPressed] = useState(false);

  // Release on anything which ends a press, wherever it lands
  useEffect(() => {
    if (!pressed) {
      return;
    }

    function release(): void {
      setPressed(false);
    }

    document.addEventListener('pointerup', release, true);
    document.addEventListener('pointercancel', release, true);
    document.addEventListener('drop', release, true);
    document.addEventListener('dragend', release, true);

    return () => {
      document.removeEventListener('pointerup', release, true);
      document.removeEventListener('pointercancel', release, true);
      document.removeEventListener('drop', release, true);
      document.removeEventListener('dragend', release, true);
    };
  }, [pressed]);

  const handlePointerDown = useCallback(() => {
    setPressed(true);
  }, []);

  return {
    pressed,
    pressedProps: {
      'data-pressed': pressed,
      onPointerDown: handlePointerDown,
    },
  };
}
