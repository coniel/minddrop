import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { FontSizeControl } from './FontSizeControl';

// The size passed to the most recent change callback
let changedSize: number | null;

/**
 * Renders the control with a recording change callback and opens
 * it. The picker opens on hover in use, which the hover menu hook
 * has its own tests for; pressing the trigger opens it
 * synchronously.
 *
 * @param value - The size the text is set at.
 */
function renderControl(value = 14) {
  changedSize = null;

  render(
    <FloatingToolbar visible>
      <FontSizeControl
        value={value}
        onValueChange={(fontSize) => {
          changedSize = fontSize;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Font size'));
}

describe('FontSizeControl', () => {
  afterEach(cleanup);

  it('shows the size on the trigger', () => {
    renderControl(18);

    expect(screen.getByLabelText('Font size')).toHaveTextContent('18');
  });

  it('offers the ladder of sizes', () => {
    renderControl();

    expect(screen.getByLabelText('10')).toBeInTheDocument();
    expect(screen.getByLabelText('48')).toBeInTheDocument();
  });

  it('marks the ladder size the text is set at', () => {
    renderControl(16);

    expect(screen.getByLabelText('16')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('14')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('sets the chosen ladder size', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('24'));

    expect(changedSize).toBe(24);
  });

  it('steps the size from the field buttons', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('Increase'));

    expect(changedSize).toBe(15);
  });

  it('sets a size typed into the field', () => {
    renderControl();

    const field = screen.getByLabelText('Custom size');

    fireEvent.change(field, { target: { value: '15' } });
    fireEvent.blur(field);

    expect(changedSize).toBe(15);
  });
});
