import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, Entry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { AddedContent } from '../AddContentMenu';
import { cleanup, setup } from '../test-utils';
import { AddContentPicker } from './AddContentPicker';

const { objectEntry1 } = DatabaseFixtures;

// An entry modified after everything the fixtures carry, so it
// fills the recent list.
const recentEntry: Entry = {
  ...objectEntry1,
  id: 'database-entry_recent',
  title: 'Recent entry',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

describe('<AddContentPicker />', () => {
  beforeEach(() => {
    setup();

    DatabaseEntries.Store.load([recentEntry]);
  });

  afterEach(cleanup);

  it('adds the picked content inside a host which takes focus on mousedown', async () => {
    const added: AddedContent[] = [];

    render(<FocusTakingHost onAdd={(content) => added.push(content)} />);

    await userEvent.click(screen.getByText(recentEntry.title));

    expect(added).toEqual([{ id: recentEntry.id, created: false }]);
  });
});

interface FocusTakingHostProps {
  /**
   * Called with the content added through the picker.
   */
  onAdd: (content: AddedContent) => void;
}

/**
 * Hosts the picker the way a canvas does: it takes focus on every
 * mousedown within it, and unmounts the picker once dismissed.
 */
function FocusTakingHost({ onAdd }: FocusTakingHostProps) {
  const [open, setOpen] = useState(true);

  // Move focus to the host's own element
  function handleMouseDown() {
    screen.getByTestId('host').focus();
  }

  return (
    <div data-testid="host" tabIndex={-1} onMouseDown={handleMouseDown}>
      {open && (
        <AddContentPicker onAdd={onAdd} onDismiss={() => setOpen(false)} />
      )}
    </div>
  );
}
