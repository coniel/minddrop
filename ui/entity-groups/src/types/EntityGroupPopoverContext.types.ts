import { Anchor } from '@minddrop/ui-primitives';

export interface EntityGroupPopoverContext {
  /**
   * The anchor the group's follow-up popovers position themselves
   * against, matching the menu which opened them: the right click
   * position for the context menu, the options button for the
   * dropdown.
   */
  anchor: Anchor;
}

export interface EntityGroupAddPopoverContext {
  /**
   * The position of the add button, frozen at the point it was
   * clicked.
   */
  anchor: Anchor;

  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;
}
