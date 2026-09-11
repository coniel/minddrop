import { afterEach, describe, expect, it } from 'vitest';
import { ElementColor } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { ElementColorControl } from './ElementColorControl';

// The colour passed to the most recent change callback
let changedColor: ElementColor | null;

/**
 * Renders the control with a recording change callback and opens
 * it. The picker opens on hover in use, which the hover menu hook
 * has its own tests for; pressing the trigger opens it
 * synchronously.
 *
 * @param value - The colour the element is drawn in.
 */
function renderControl(
  value: ElementColor = { color: 'default', level: 1200 },
) {
  changedColor = null;

  render(
    <FloatingToolbar visible>
      <ElementColorControl
        label="designsNext.settings.textColor.label"
        value={value}
        onValueChange={(color) => {
          changedColor = color;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Text colour'));
}

describe('ElementColorControl', () => {
  afterEach(cleanup);

  it('opens the colour picker', () => {
    renderControl();

    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
  });

  it('sets the chosen colour', () => {
    renderControl({ color: 'default', level: 900 });

    fireEvent.click(screen.getByLabelText('Green'));

    expect(changedColor).toEqual({ color: 'green', level: 900 });
  });

  it('carries the colour it sets on its trigger', () => {
    renderControl({ color: 'brown', level: 600 });

    const swatch = screen.getByLabelText('Text colour').firstElementChild;

    expect(swatch?.getAttribute('style')).toContain(
      'background: var(--brown-600)',
    );
  });
});
