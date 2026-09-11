import { afterEach, describe, expect, it } from 'vitest';
import { ElementColor } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../test-utils';
import { ElementColorSelect } from './ElementColorSelect';

// The colour passed to the most recent change callback
let changedColor: ElementColor | null;

/**
 * Renders the picker with a recording change callback.
 *
 * @param value - The colour the element is drawn in.
 */
function renderSelect(value: ElementColor = { color: 'default', level: 1200 }) {
  changedColor = null;

  render(
    <ElementColorSelect
      value={value}
      onValueChange={(color) => {
        changedColor = color;
      }}
    />,
  );
}

describe('ElementColorSelect', () => {
  afterEach(cleanup);

  it('offers the content colours and the steps of their ramps', () => {
    renderSelect();

    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Shade 100')).toBeInTheDocument();
    expect(screen.getByLabelText('Shade 1200')).toBeInTheDocument();
  });

  it('sets the chosen colour, holding its step', () => {
    renderSelect({ color: 'default', level: 700 });

    fireEvent.click(screen.getByLabelText('Red'));

    expect(changedColor).toEqual({ color: 'red', level: 700 });
  });

  it('sets the chosen step, holding its colour', () => {
    renderSelect({ color: 'green', level: 700 });

    fireEvent.click(screen.getByLabelText('Shade 400'));

    expect(changedColor).toEqual({ color: 'green', level: 400 });
  });

  it('draws the steps in the chosen colour', () => {
    renderSelect({ color: 'purple', level: 700 });

    const swatch = screen.getByLabelText('Shade 400').firstElementChild;

    // jsdom keeps the custom property in the style attribute but
    // cannot resolve it, so the attribute itself is the assertion.
    expect(swatch?.getAttribute('style')).toContain(
      'background: var(--purple-400)',
    );
    expect(swatch).toHaveClass('content-color-swatch');
  });

  it('marks the colour and step the element is drawn in', () => {
    renderSelect({ color: 'orange', level: 500 });

    expect(screen.getByLabelText('Orange')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Shade 500')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
