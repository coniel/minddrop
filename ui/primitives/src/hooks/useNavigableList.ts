import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface UseNavigableListOptions {
  /**
   * Total number of items in the list.
   */
  itemCount: number;

  /**
   * Called when the user activates the highlighted item
   * (Enter key or click).
   */
  onSelect: (index: number) => void;

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
}

export interface NavigableListInputProps {
  /**
   * Keydown handler to attach to the input element.
   */
  onKeyDown: React.KeyboardEventHandler;
}

export interface NavigableListContainerProps {
  /**
   * Mouse move handler to attach to the scrollable
   * list container.
   */
  onMouseMove: React.MouseEventHandler;
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
   * Click handler that activates the item.
   */
  onClick: () => void;

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
   * Returns props to spread onto the scrollable list container.
   */
  getContainerProps: () => NavigableListContainerProps;

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
}: UseNavigableListOptions): UseNavigableListReturn {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Flag to ignore mouse events triggered by keyboard
  // scroll-into-view shifting items under the cursor
  const isKeyboardNavRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });

  // Reset highlighted index when item count changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [itemCount]);

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
        isKeyboardNavRef.current = true;
        setHighlightedIndex((index) => (index < itemCount - 1 ? index + 1 : 0));
      } else if (
        event.key === 'ArrowUp' ||
        (event.key === 'Tab' && event.shiftKey)
      ) {
        event.preventDefault();
        isKeyboardNavRef.current = true;
        setHighlightedIndex((index) => (index > 0 ? index - 1 : itemCount - 1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onSelect(highlightedIndex);
      }
    },
    [enabled, itemCount, highlightedIndex, onSelect, onEscape],
  );

  // Container mouse move handler that detects real vs
  // scroll-induced mouse movement
  const handleContainerMouseMove = useCallback((event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const last = lastMousePositionRef.current;

    if (clientX !== last.x || clientY !== last.y) {
      lastMousePositionRef.current = { x: clientX, y: clientY };
      isKeyboardNavRef.current = false;
    }
  }, []);

  const getInputProps = useCallback(
    (): NavigableListInputProps => ({
      onKeyDown: handleKeyDown,
    }),
    [handleKeyDown],
  );

  const getContainerProps = useCallback(
    (): NavigableListContainerProps => ({
      onMouseMove: handleContainerMouseMove,
    }),
    [handleContainerMouseMove],
  );

  const getItemProps = useCallback(
    (index: number): NavigableListItemProps => ({
      ref: index === highlightedIndex ? scrollIntoViewRef : () => {},
      onMouseMove: () => {
        if (isKeyboardNavRef.current) {
          return;
        }

        if (highlightedIndex !== index) {
          setHighlightedIndex(index);
        }
      },
      onClick: () => onSelect(index),
      highlighted: index === highlightedIndex,
    }),
    [highlightedIndex, onSelect, scrollIntoViewRef],
  );

  return {
    highlightedIndex,
    setHighlightedIndex,
    getInputProps,
    getContainerProps,
    getItemProps,
  };
}
