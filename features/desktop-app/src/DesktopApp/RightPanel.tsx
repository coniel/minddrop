import React from 'react';
import { Slot } from '@minddrop/ui-views';
import { Views } from '@minddrop/views';

/**
 * The shell's right panel frame, rendering what the active session
 * shows beside its view area. Renders no frame at all while the
 * session shows nothing, so the view area gets the width.
 */
export const RightPanel: React.FC = () => {
  const { resolved } = Views.useSlotState('right-panel');

  // Render no frame while the panel is empty
  if (!resolved) {
    return null;
  }

  return (
    <div className="right-panel">
      <Slot id="right-panel" />
    </div>
  );
};
