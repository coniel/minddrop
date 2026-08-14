import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { BlockActionsMenu, BlockActionsMenuProps } from './BlockActionsMenu';

/**
 * Renders the menu open, with no-op callbacks for the actions a
 * test is not concerned with.
 *
 * @param props The props to render with.
 * @returns The render result.
 */
function renderMenu(props: Partial<BlockActionsMenuProps> = {}) {
  return render(
    <BlockActionsMenu
      open
      onOpenChange={() => undefined}
      onOpenChangeComplete={() => undefined}
      anchorRef={createRef()}
      onTurnInto={() => undefined}
      onCopy={() => undefined}
      onDuplicate={() => undefined}
      onDelete={() => undefined}
      {...props}
    />,
  );
}

describe('BlockActionsMenu', () => {
  afterEach(cleanup);

  it('renders nothing while closed', () => {
    const { queryByText } = renderMenu({ open: false });

    expect(queryByText('Duplicate')).toBeNull();
  });

  it('renders the actions', () => {
    const { getByText } = renderMenu();

    getByText('Turn into');
    getByText('Copy');
    getByText('Duplicate');
    getByText('Delete');
  });

  it('copies the blocks', () => {
    const copies: string[] = [];
    const { getByText } = renderMenu({ onCopy: () => copies.push('copy') });

    fireEvent.click(getByText('Copy'));

    expect(copies).toEqual(['copy']);
  });

  it('duplicates the blocks', () => {
    const duplicates: string[] = [];
    const { getByText } = renderMenu({
      onDuplicate: () => duplicates.push('duplicate'),
    });

    fireEvent.click(getByText('Duplicate'));

    expect(duplicates).toEqual(['duplicate']);
  });

  it('deletes the blocks', () => {
    const deletions: string[] = [];
    const { getByText } = renderMenu({
      onDelete: () => deletions.push('delete'),
    });

    fireEvent.click(getByText('Delete'));

    expect(deletions).toEqual(['delete']);
  });

  it('does not let its events reach handlers around the editor', () => {
    // Events which reached the surrounding element
    const surroundingEvents: string[] = [];

    const { getByText } = render(
      <div
        onClick={() => surroundingEvents.push('click')}
        onMouseDown={() => surroundingEvents.push('mousedown')}
      >
        <BlockActionsMenu
          open
          onOpenChange={() => undefined}
          onOpenChangeComplete={() => undefined}
          anchorRef={createRef()}
          onTurnInto={() => undefined}
          onCopy={() => undefined}
          onDuplicate={() => undefined}
          onDelete={() => undefined}
        />
      </div>,
    );

    fireEvent.mouseDown(getByText('Duplicate'));
    fireEvent.click(getByText('Duplicate'));

    expect(surroundingEvents).toEqual([]);
  });

  it('turns the blocks into a registered type', () => {
    // The type and data collected from the callback
    const conversions: [string, Partial<Element> | undefined][] = [];
    const { getByText } = renderMenu({
      onTurnInto: (type, data) => conversions.push([type, data]),
    });

    // Open the submenu of block types
    fireEvent.click(getByText('Turn into'));
    fireEvent.click(getByText('Heading 2'));

    expect(conversions).toEqual([['heading', { level: 2 }]]);
  });
});
