import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { SelectionToolbar } from './SelectionToolbar';

initializeI18n();

// The position of the selected text, which the toolbar is shown against.
// jsdom provides no DOMRect constructor, so the measured rect is stood in
// for by its shape.
const anchor = {
  rect: {
    x: 10,
    y: 20,
    top: 20,
    left: 10,
    right: 110,
    bottom: 36,
    width: 100,
    height: 16,
    toJSON: () => ({}),
  } as DOMRect,
  fontSize: '16px',
  color: 'rgb(0, 0, 0)',
};

describe('SelectionToolbar', () => {
  afterEach(cleanup);

  it('is not shown without a selection', () => {
    const { queryByLabelText } = render(
      <SelectionToolbar
        anchor={null}
        activeMarks={[]}
        onToggleMark={vi.fn()}
      />,
    );

    expect(queryByLabelText('Bold')).toBeNull();
  });

  it('offers a control for each of the marks', async () => {
    const { findByLabelText } = render(
      <SelectionToolbar
        anchor={anchor}
        activeMarks={[]}
        onToggleMark={vi.fn()}
      />,
    );

    // The controls are portalled, so they arrive asynchronously
    await findByLabelText('Bold');
    await findByLabelText('Italic');
    await findByLabelText('Strikethrough');
    await findByLabelText('Code');
  });

  it('shows the marks the selection already carries as pressed', async () => {
    const { findByLabelText } = render(
      <SelectionToolbar
        anchor={anchor}
        activeMarks={['bold']}
        onToggleMark={vi.fn()}
      />,
    );

    expect(await findByLabelText('Bold')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(await findByLabelText('Italic')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('toggles the mark it is pressed for', async () => {
    const onToggleMark = vi.fn();
    const { findByLabelText } = render(
      <SelectionToolbar
        anchor={anchor}
        activeMarks={[]}
        onToggleMark={onToggleMark}
      />,
    );

    fireEvent.click(await findByLabelText('Italic'));

    expect(onToggleMark).toHaveBeenCalledWith('italic');
  });

  it('keeps the focus in the editor when pressed', async () => {
    const { findByLabelText } = render(
      <SelectionToolbar
        anchor={anchor}
        activeMarks={[]}
        onToggleMark={vi.fn()}
      />,
    );

    const button = await findByLabelText('Bold');
    const mouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    fireEvent(button, mouseDown);

    // A press which moved the focus would drop the selection the marks
    // are applied to
    expect(mouseDown.defaultPrevented).toBe(true);
  });
});
