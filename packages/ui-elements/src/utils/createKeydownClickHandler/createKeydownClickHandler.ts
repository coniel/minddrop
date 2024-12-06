import React from 'react';

export type KeyboardAccessibleClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
) => void;

export function createKeydownClickHandler(
  clickHandler?: KeyboardAccessibleClickHandler,
  onKeyDown?: React.KeyboardEventHandler,
): (event: React.KeyboardEvent) => void {
  return (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (onKeyDown) {
      onKeyDown(event);
    }

    if (clickHandler) {
      clickHandler(event);
    }

    // prevent window from scrolling
    event.preventDefault();
  };
}
