import { afterEach, describe, expect, it } from 'vitest';
import { TextAlign } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { TextAlignMenu } from './TextAlignMenu';

// The alignment passed to the most recent change callback
let changedAlign: TextAlign | null;

// The options the menu offers, in display order
const optionLabels = ['Left', 'Centre', 'Right', 'Justify'];

/**
 * Renders the menu with a recording change callback and opens it.
 * The menu opens on hover in use, which the primitive has its own
 * tests for; pressing the trigger opens it synchronously.
 *
 * @param value - The alignment the text is set in.
 */
function renderMenu(value: TextAlign = 'left') {
  changedAlign = null;

  render(
    <FloatingToolbar visible>
      <TextAlignMenu
        value={value}
        onValueChange={(textAlign) => {
          changedAlign = textAlign;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Text align'));
}

describe('TextAlignMenu', () => {
  afterEach(cleanup);

  it('offers each alignment', () => {
    renderMenu();

    optionLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('sets the chosen alignment', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText('Right'));

    expect(changedAlign).toBe('right');
  });

  it('marks the alignment the text is set in', () => {
    renderMenu('center');

    expect(screen.getByLabelText('Centre')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Left')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
