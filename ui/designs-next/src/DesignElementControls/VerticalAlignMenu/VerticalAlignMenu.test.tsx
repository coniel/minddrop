import { afterEach, describe, expect, it } from 'vitest';
import { VerticalAlign } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { VerticalAlignMenu } from './VerticalAlignMenu';

// The alignment passed to the most recent change callback
let changedAlign: VerticalAlign | null;

// The options the menu offers, in display order
const optionLabels = ['Top', 'Middle', 'Bottom'];

/**
 * Renders the menu with a recording change callback and opens it.
 * The menu opens on hover in use, which the primitive has its own
 * tests for; pressing the trigger opens it synchronously.
 *
 * @param value - The alignment the text is set in.
 */
function renderMenu(value: VerticalAlign = 'top') {
  changedAlign = null;

  render(
    <FloatingToolbar visible>
      <VerticalAlignMenu
        value={value}
        onValueChange={(verticalAlign) => {
          changedAlign = verticalAlign;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Vertical align'));
}

describe('VerticalAlignMenu', () => {
  afterEach(cleanup);

  it('offers each alignment', () => {
    renderMenu();

    optionLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('sets the chosen alignment', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText('Bottom'));

    expect(changedAlign).toBe('bottom');
  });

  it('marks the alignment the text is set in', () => {
    renderMenu('middle');

    expect(screen.getByLabelText('Middle')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Top')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
