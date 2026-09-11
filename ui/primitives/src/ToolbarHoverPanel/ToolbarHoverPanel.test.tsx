import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '../FloatingToolbar';
import { IconButton } from '../IconButton';
import { ToolbarHoverPanel } from './ToolbarHoverPanel';

// The attribute the panel marks its host toolbar with
const SquaredCornersAttribute = 'data-hover-menu-squared';

/**
 * Renders the panel in a toolbar and opens it. The panel opens on
 * hover in use, which the hover menu hook has its own tests for;
 * pressing the trigger opens it synchronously.
 *
 * @param leadingControl - Whether a control stands before the
 *   panel's trigger in the toolbar.
 */
function renderPanel(leadingControl = true) {
  const { container } = render(
    <FloatingToolbar visible>
      {leadingControl && <IconButton icon="pin" label="actions.done" />}
      <ToolbarHoverPanel label="Colour" trigger={<span>swatch</span>}>
        <span>panel content</span>
      </ToolbarHoverPanel>
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Colour'));

  return container.querySelector('.floating-toolbar');
}

describe('ToolbarHoverPanel', () => {
  afterEach(cleanup);

  it('opens the panel', () => {
    renderPanel();

    expect(screen.getByText('panel content')).toBeInTheDocument();
  });

  it('squares the toolbar corner it runs past', () => {
    const host = renderPanel();

    expect(host).toHaveAttribute(SquaredCornersAttribute, 'bottom-right');
  });

  it('squares the toolbar start as well when it reaches out of the first control', () => {
    const host = renderPanel(false);

    expect(host).toHaveAttribute(
      SquaredCornersAttribute,
      'top-right bottom-right',
    );
  });

  it('leaves the toolbar rounded once closed', () => {
    const host = renderPanel();

    fireEvent.click(screen.getByLabelText('Colour'));

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
  });
});
