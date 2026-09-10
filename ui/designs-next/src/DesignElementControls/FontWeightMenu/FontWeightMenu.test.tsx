import { afterEach, describe, expect, it } from 'vitest';
import { FontWeight } from '@minddrop/designs-next';
import { fireEvent, render, screen, within } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { FontWeightMenu } from './FontWeightMenu';

// The weight passed to the most recent change callback
let changedWeight: FontWeight | undefined | null;

// The options the menu offers, in display order
const optionLabels = [
  'Default',
  'Thin',
  'Extra light',
  'Light',
  'Regular',
  'Medium',
  'Semibold',
  'Bold',
  'Extra bold',
  'Black',
];

/**
 * Renders the menu with a recording change callback and opens it.
 * The menu opens on hover in use, which the primitive has its own
 * tests for; pressing the trigger opens it synchronously.
 *
 * @param value - The weight the text is set in.
 */
function renderMenu(value?: FontWeight) {
  changedWeight = null;

  render(
    <FloatingToolbar visible>
      <FontWeightMenu
        value={value}
        onValueChange={(fontWeight) => {
          changedWeight = fontWeight;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Font weight'));
}

describe('FontWeightMenu', () => {
  afterEach(cleanup);

  it('offers the scale alongside the default option', () => {
    renderMenu();

    optionLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('numbers each weight', () => {
    renderMenu();

    // The lightest and heaviest ends of the scale
    expect(screen.getByLabelText('Thin')).toHaveTextContent('100');
    expect(screen.getByLabelText('Black')).toHaveTextContent('900');
  });

  it('draws each option in the weight it sets', () => {
    renderMenu();

    const option = within(screen.getByLabelText('Semibold'));

    expect(option.getByText('A')).toHaveStyle({ fontWeight: '600' });

    // The number is left at the toolbar's own weight
    expect(option.getByText('600')).not.toHaveStyle({ fontWeight: '600' });
  });

  it('sets the chosen weight', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText('Light'));

    expect(changedWeight).toBe(300);
  });

  it('clears the weight when the default is chosen', () => {
    renderMenu(700);

    fireEvent.click(screen.getByLabelText('Default'));

    expect(changedWeight).toBeUndefined();
  });

  it('marks the weight the text is set in', () => {
    renderMenu(700);

    expect(screen.getByLabelText('Bold')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Regular')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
