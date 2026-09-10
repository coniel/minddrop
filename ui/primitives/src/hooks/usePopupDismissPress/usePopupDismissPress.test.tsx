import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { usePopupDismissPress } from './usePopupDismissPress';

/**
 * Reports whether the last press dismissed a popup.
 */
const PressProbe: React.FC = () => {
  const wasDismissingPopup = usePopupDismissPress();

  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.currentTarget.textContent = String(wasDismissingPopup());
      }}
    >
      press
    </button>
  );
};

/**
 * Renders an open popup in a portal, the way Base UI marks one.
 */
function renderOpenPopup() {
  const portal = document.createElement('div');

  portal.setAttribute('data-base-ui-portal', '');
  portal.innerHTML = '<div data-open></div>';
  document.body.append(portal);

  return () => portal.remove();
}

describe('usePopupDismissPress', () => {
  afterEach(cleanup);

  it('reports a press made while a popup is open', () => {
    const removePopup = renderOpenPopup();

    render(<PressProbe />);

    fireEvent.pointerDown(screen.getByRole('button'));

    expect(screen.getByRole('button').textContent).toBe('true');

    removePopup();
  });

  it('reports a press made with nothing open', () => {
    render(<PressProbe />);

    fireEvent.pointerDown(screen.getByRole('button'));

    expect(screen.getByRole('button').textContent).toBe('false');
  });
});
