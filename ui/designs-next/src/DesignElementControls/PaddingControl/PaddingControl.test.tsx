import { afterEach, describe, expect, it } from 'vitest';
import { Designs, ElementPadding } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { PaddingControl } from './PaddingControl';

// The padding passed to the most recent change callback
let changedPadding: ElementPadding | undefined | 'none';

/**
 * Renders the control with a recording change callback and opens
 * it. The picker opens on hover in use, which the hover menu hook
 * has its own tests for; pressing the trigger opens it
 * synchronously.
 *
 * @param padding - The padding the element holds.
 */
function renderControl(padding?: ElementPadding) {
  changedPadding = 'none';

  render(
    <FloatingToolbar visible>
      <PaddingControl
        value={padding}
        onValueChange={(changed) => {
          changedPadding = changed;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Padding'));
}

/**
 * Opens the scale a side is set from.
 *
 * @param side - The label of the side.
 */
function openSide(side: string) {
  fireEvent.click(screen.getByLabelText(side));
}

/**
 * Enters an amount into the open side's custom field.
 *
 * @param amount - The amount to enter.
 */
function enterCustomAmount(amount: number) {
  const field = screen.getByLabelText('Custom');

  fireEvent.change(field, { target: { value: String(amount) } });
  fireEvent.blur(field);
}

describe('PaddingControl', () => {
  afterEach(cleanup);

  it('reads out the step each side sits on', () => {
    renderControl({ top: Designs.constants.PaddingSizes.l, left: 20 });

    // The step by its name, an amount off the scale as itself, and
    // a side holding no room as a dash.
    expect(screen.getByLabelText('Padding top')).toHaveTextContent('L');
    expect(screen.getByLabelText('Padding left')).toHaveTextContent('20');
    expect(screen.getByLabelText('Padding right')).toHaveTextContent('—');
  });

  it('sets the side the amount was chosen for', () => {
    renderControl({ top: 16 });

    openSide('Padding bottom');
    fireEvent.click(screen.getByLabelText('2XL'));

    expect(changedPadding).toEqual({
      top: 16,
      bottom: Designs.constants.PaddingSizes['2xl'],
    });
  });

  it('sets an amount off the scale', () => {
    renderControl();

    openSide('Padding top');
    enterCustomAmount(20);

    expect(changedPadding).toEqual({ top: 20 });
  });

  it('opens no scale until a side is pressed', () => {
    renderControl();

    expect(screen.queryByLabelText('Custom')).toBeNull();

    openSide('Padding top');

    expect(screen.getByLabelText('Custom')).toBeInTheDocument();
  });

  it('holds no padding once every side is cleared', () => {
    renderControl({ top: 16 });

    openSide('Padding top');
    fireEvent.click(screen.getByLabelText('None'));

    expect(changedPadding).toBeUndefined();
  });

  it('sets every side while they are linked', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('Link sides'));
    openSide('Padding top');
    fireEvent.click(screen.getByLabelText('M'));

    const amount = Designs.constants.PaddingSizes.m;

    expect(changedPadding).toEqual({
      top: amount,
      right: amount,
      bottom: amount,
      left: amount,
    });
  });

  it('equalises the sides on the top side when linking', () => {
    renderControl({ top: 16, left: 8 });

    fireEvent.click(screen.getByLabelText('Link sides'));

    expect(changedPadding).toEqual({
      top: 16,
      right: 16,
      bottom: 16,
      left: 16,
    });
  });
});
