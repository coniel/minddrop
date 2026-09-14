import { afterEach, describe, expect, it } from 'vitest';
import { TextSettings } from '@minddrop/designs-next';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../../test-utils';
import { FontControl } from './FontControl';

// The settings passed to the most recent change callback
let changedSettings: Partial<TextSettings> | null;

/**
 * Renders the control with a recording change callback and opens
 * it. The picker opens on hover in use, which the hover menu hook
 * has its own tests for; pressing the trigger opens it
 * synchronously.
 *
 * @param settings - The settings the text is set in.
 */
function renderControl(settings: Partial<TextSettings> = {}) {
  changedSettings = null;

  render(
    <FloatingToolbar visible>
      <FontControl
        element={{ ...bodyDesignElement, ...settings }}
        onChange={(changed) => {
          changedSettings = changed;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Font'));
}

describe('FontControl', () => {
  afterEach(cleanup);

  it('shows a sample in the family in use on the trigger', () => {
    renderControl({ fontFamily: 'serif' });

    expect(screen.getByLabelText('Font')).toHaveTextContent('Ag');
    expect(screen.getByText('Ag')).toHaveClass(
      'design-font-control-sample-serif',
    );
  });

  it('names each family in its own face', () => {
    renderControl();

    expect(screen.getByText('Mono')).toHaveClass(
      'design-font-control-sample-mono',
    );
  });

  it('marks the family the text is set in', () => {
    renderControl({ fontFamily: 'serif' });

    expect(screen.getByLabelText('Serif')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Sans')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('sets the chosen family', () => {
    renderControl();

    fireEvent.click(screen.getByLabelText('Mono'));

    expect(changedSettings).toEqual({ fontFamily: 'mono' });
  });

  it('toggles the styles', () => {
    renderControl({ underline: true });

    fireEvent.click(screen.getByLabelText('Italic'));

    expect(changedSettings).toEqual({ italic: true });

    fireEvent.click(screen.getByLabelText('Underline'));

    expect(changedSettings).toEqual({ underline: false });

    fireEvent.click(screen.getByLabelText('Strikethrough'));

    expect(changedSettings).toEqual({ strikethrough: true });
  });
});
