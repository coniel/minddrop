import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { UiIconName } from '@minddrop/ui-icons';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { NumberLadderControl } from './NumberLadderControl';

// The value passed to the most recent change callback
let changedValue: number | null;

/**
 * Renders the control as the font size picker with a recording
 * change callback and opens it. The picker opens on hover in use,
 * which the hover menu hook has its own tests for; pressing the
 * trigger opens it synchronously.
 *
 * @param value - The current value.
 * @param icon - The trigger's icon, if any.
 */
function renderControl(value = 14, icon?: UiIconName) {
  changedValue = null;

  render(
    <FloatingToolbar visible>
      <NumberLadderControl
        label="designsNext.settings.fontSize.label"
        icon={icon}
        value={value}
        ladder={[10, 12, 14, 16, 24]}
        min={6}
        max={200}
        onValueChange={(chosenValue) => {
          changedValue = chosenValue;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Font size'));
}

describe('NumberLadderControl', () => {
  afterEach(cleanup);

  it('shows the value on the trigger', () => {
    renderControl(18);

    expect(screen.getByLabelText('Font size')).toHaveTextContent('18');
  });

  it('leaves the value off the trigger when it has an icon', () => {
    renderControl(18, 'list-chevrons-up-down');

    expect(screen.getByLabelText('Font size')).not.toHaveTextContent('18');
  });

  it('offers the ladder under the control label', () => {
    renderControl();

    expect(screen.getByText('Font size')).toBeInTheDocument();

    expect(screen.getByLabelText('10')).toBeInTheDocument();
    expect(screen.getByLabelText('24')).toBeInTheDocument();
  });

  it('marks the ladder value in use', () => {
    renderControl(16);

    expect(screen.getByLabelText('16')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('14')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('sets the chosen ladder value', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('24'));

    expect(changedValue).toBe(24);
  });

  it('steps the value from the field buttons', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('Increase'));

    expect(changedValue).toBe(15);
  });

  it('sets a value typed into the field', () => {
    renderControl();

    const field = screen.getByLabelText('Custom');

    fireEvent.change(field, { target: { value: '15' } });
    fireEvent.blur(field);

    expect(changedValue).toBe(15);
  });
});
