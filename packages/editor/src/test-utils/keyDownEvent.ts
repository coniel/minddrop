import React from 'react';

/**
 * Creates a keydown event carrying only the parts the handlers read.
 *
 * @param key - The pressed key.
 * @param modifiers - The held modifier keys.
 * @returns The event.
 */
export function keyDownEvent(
  key: string,
  modifiers: Partial<React.KeyboardEvent<HTMLDivElement>> = {},
): React.KeyboardEvent<HTMLDivElement> {
  // Assemble the parts of the event the handlers read
  const event = {
    key,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    preventDefault: () => undefined,
    ...modifiers,
  };

  return event as React.KeyboardEvent<HTMLDivElement>;
}
