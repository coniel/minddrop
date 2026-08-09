import React, { useCallback, useEffect, useState } from 'react';
import { isKeyboardInputMode } from '../utils/isKeyboardInputMode';

export interface UseNavigableListOptions {
  /**
   * Total number of items in the list.
   */
  itemCount: number;

  /**
   * Called when the user activates the highlighted item
   * (Enter key or click). Receives whether the Shift key was
   * held during activation.
   */
  onSelect: (index: number, shiftKey?: boolean) => void;

  /**
   * Called when the user presses Escape. Receives the
   * keyboard event so the consumer can control propagation.
   */
  onEscape?: (event: React.KeyboardEvent) => void;

  /**
   * Whether the navigable list is active. When false,
   * keyboard events are ignored.
   * @default true
   */
  enabled?: boolean;

  /**
   * Initial highlighted index. Use -1 for no initial highlight.
   * Also used as the reset value when item count changes.
   * @default 0
   */
  initialIndex?: number;
}

export interface NavigableListInputProps {
  /**
   * Keydown handler to attach to the input element.
   */
  onKeyDown: React.KeyboardEventHandler;
}

export interface NavigableListItemProps {
  /**
   * Ref callback that scrolls the highlighted item
   * into view.
   */
  ref: (node: HTMLElement | null) => void;

  /**
   * Mouse move handler that updates the highlighted
   * index on hover.
   */
  onMouseMove: () => void;

  /**
   * Mouse leave handler that clears the highlight.
   */
  onMouseLeave: () => void;

  /**
   * Click handler that activates the item.
   */
  onClick: (event: React.MouseEvent) => void;

  /**
   * Whether this item is currently highlighted.
   */
  highlighted: boolean;
}

export interface UseNavigableListReturn {
  /**
   * Currently highlighted item index.
   */
  highlightedIndex: number;

  /**
   * Set highlighted index directly.
   */
  setHighlightedIndex: (index: number) => void;

  /**
   * Returns props to spread onto the input/trigger element.
   */
  getInputProps: () => NavigableListInputProps;

  /**
   * Returns props for a single list item at the given index.
   */
  getItemProps: (index: number) => NavigableListItemProps;
}

/**
 * Manages keyboard and mouse navigation for a list of items
 * paired with a text input. Handles arrow/tab cycling, enter
 * to select, escape forwarding, scroll-into-view, and
 * keyboard/mouse interaction conflicts.
 */
export function useNavigableList({
  itemCount,
  onSelect,
  onEscape,
  enabled = true,
  initialIndex = 0,
}: UseNavigableListOptions): UseNavigableListReturn {
  const [highlightedIndex, setHighlightedIndex] = useState(initialIndex);

  // Reset highlighted index when item count changes
  useEffect(() => {
    setHighlightedIndex(initialIndex);
  }, [itemCount, initialIndex]);

  // Scroll the highlighted item into view
  const scrollIntoViewRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      node.scrollIntoView({ block: 'nearest' });
    }
  }, []);

  // Keydown handler for the input element
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!enabled) {
        return;
      }

      // Forward escape to consumer
      if (event.key === 'Escape') {
        onEscape?.(event);

        return;
      }

      if (itemCount === 0) {
        return;
      }

      if (
        event.key === 'ArrowDown' ||
        (event.key === 'Tab' && !event.shiftKey)
      ) {
        event.preventDefault();
        setHighlightedIndex((index) => (index < itemCount - 1 ? index + 1 : 0));
      } else if (
        event.key === 'ArrowUp' ||
        (event.key === 'Tab' && event.shiftKey)
      ) {
        event.preventDefault();
        setHighlightedIndex((index) => (index > 0 ? index - 1 : itemCount - 1));
      } else if (event.key === 'Enter') {
        if (highlightedIndex === -1) {
          return;
        }

        event.preventDefault();
        onSelect(highlightedIndex, event.shiftKey);
      }
    },
    [enabled, itemCount, highlightedIndex, onSelect, onEscape],
  );

  const getInputProps = useCallback(
    (): NavigableListInputProps => ({
      onKeyDown: handleKeyDown,
    }),
    [handleKeyDown],
  );

  const getItemProps = useCallback(
    (index: number): NavigableListItemProps => ({
      ref: index === highlightedIndex ? scrollIntoViewRef : () => {},
      onMouseMove: () => {
        // Mouse events fired while the keyboard owns the
        // navigation come from items shifting under a stationary
        // cursor, not from the user pointing at them
        if (isKeyboardInputMode()) {
          return;
        }

        if (highlightedIndex !== index) {
          setHighlightedIndex(index);
        }
      },
      onMouseLeave: () => {
        if (!isKeyboardInputMode()) {
          setHighlightedIndex(-1);
        }
      },
      onClick: (event: React.MouseEvent) => onSelect(index, event.shiftKey),
      highlighted: index === highlightedIndex,
    }),
    [highlightedIndex, onSelect, scrollIntoViewRef],
  );

  return {
    highlightedIndex,
    setHighlightedIndex,
    getInputProps,
    getItemProps,
  };
}
