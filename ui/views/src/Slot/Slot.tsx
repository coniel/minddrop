import { FC } from 'react';
import { SessionSlot, SlotFillKind, Views } from '@minddrop/views';

export interface SlotProps {
  /**
   * The id of the slot, which is the kind of fill it renders.
   */
  id: SlotFillKind;

  /**
   * What to render when the active session names no fill for the
   * slot, or names one which is not registered: a slot state naming
   * the fill and its props, or the id of a fill taking no props.
   * Without a fallback the slot renders nothing.
   */
  fallback?: SessionSlot | string;
}

/**
 * Renders the fill the active session of the surrounding view area
 * (the main one outside of a view pane) shows in a shell slot,
 * falling back to the given fill when it names none. Renders nothing
 * while the session hides the slot.
 */
export const Slot: FC<SlotProps> = ({ id, fallback }) => {
  const { resolved } = Views.useSlotState(id, fallback);

  // Nothing to render without a fill
  if (!resolved) {
    return null;
  }

  return <resolved.fill.component {...resolved.props} />;
};
