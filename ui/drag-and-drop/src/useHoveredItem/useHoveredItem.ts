import { useCallback } from 'react';
import { createVanillaStore, useStore } from '@minddrop/stores';

interface HoveredItemState {
  /**
   * The ID of the item the pointer is over, or null when it is over
   * none of them.
   */
  hoveredId: string | null;

  /**
   * Whether the pointer is parked where a drag left it, having not
   * moved since.
   */
  parked: boolean;
}

const HoveredItemStore = createVanillaStore<HoveredItemState>(() => ({
  hoveredId: null,
  parked: false,
}));

// The position the pointer is known to hold, used to tell real
// movement from the move events fired when content shifts beneath a
// stationary pointer
let lastPosition: { x: number; y: number } | null = null;

// Whether the document listeners are attached. They live for the
// app's lifetime, set up by the first item to use the hook.
let listening = false;

export interface HoveredItem {
  /**
   * Whether the pointer is over the item.
   */
  hovered: boolean;

  /**
   * Props spread onto the item to track the pointer.
   */
  hoveredProps: {
    'data-hovered': boolean;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
}

/**
 * Tracks whether the pointer is over an item, for the panel's
 * draggable rows, which cannot use `:hover`.
 *
 * A native drag freezes hover for its duration and the browser does
 * not always retire the chain it froze, so rows accumulate a hover
 * state which nothing clears: several light up at once, including
 * rows the pointer left long ago. Holding a single hovered ID makes
 * that impossible, since one row becoming hovered is what unhovers
 * the last.
 *
 * A drop also reflows the panel beneath a stationary pointer, and
 * the browser announces whatever slid underneath as newly entered.
 * Hover is therefore withheld until the pointer moves under its own
 * steam, so a row has to be pointed at to light up.
 *
 * @param id - The ID of the item, unique within the panel.
 */
export function useHoveredItem(id: string): HoveredItem {
  const hovered = useStore(HoveredItemStore, (state) => state.hoveredId === id);

  listenForPointer();

  // Taking hover releases whichever item held it, which is what a
  // missed pointerleave would otherwise leave behind
  const handlePointerEnter = useCallback(() => {
    // The pointer has not moved since the drop, so this is the panel
    // moving under it rather than the user pointing at anything
    if (HoveredItemStore.getState().parked) {
      return;
    }

    HoveredItemStore.setState({ hoveredId: id });
  }, [id]);

  // Only release hover when it is still this item's to release, so
  // that a late leave cannot unhover its successor
  const handlePointerLeave = useCallback(() => {
    HoveredItemStore.setState((state) =>
      state.hoveredId === id ? { hoveredId: null } : state,
    );
  }, [id]);

  return {
    hovered,
    hoveredProps: {
      'data-hovered': hovered,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
  };
}

/**
 * Clears the hovered item and forgets where the pointer was. Used to
 * reset state between tests.
 */
export function resetHoveredItem(): void {
  lastPosition = null;

  HoveredItemStore.setState({ hoveredId: null, parked: false });
}

/**
 * Attaches the document listeners which decide when hover may be
 * taken, once for the app's lifetime.
 */
function listenForPointer(): void {
  if (listening) {
    return;
  }

  listening = true;

  // A drag takes the pointer over, so the item it started from is no
  // longer hovered and will never be told it was left. Nothing may
  // take hover until the pointer is moved deliberately again.
  document.addEventListener(
    'dragstart',
    () => {
      HoveredItemStore.setState({ hoveredId: null, parked: true });
    },
    true,
  );

  document.addEventListener(
    'pointermove',
    (event) => {
      const moved =
        lastPosition &&
        (event.clientX !== lastPosition.x || event.clientY !== lastPosition.y);

      lastPosition = { x: event.clientX, y: event.clientY };

      // Content settling under a stationary pointer fires a move at
      // the position it already occupies, which is not the user
      // moving it
      if (!moved) {
        return;
      }

      if (HoveredItemStore.getState().parked) {
        HoveredItemStore.setState({ parked: false });
      }
    },
    true,
  );
}
