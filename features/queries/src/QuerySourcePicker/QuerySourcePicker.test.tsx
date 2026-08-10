import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { DatabaseId } from '@minddrop/databases';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QuerySourcePicker } from './QuerySourcePicker';

const { objectDatabase, urlDatabase } = DatabaseFixtures;

interface FocusStealingHostProps {
  /**
   * Receives the picked database ID.
   */
  onSelect(databaseId: DatabaseId): void;
}

/**
 * Hosts the picker inside a wrapper which focuses itself on any
 * mousedown and unmounts the picker on dismissal, mimicking the
 * canvas viewport's focus-scoped shortcut handling and the
 * builder's dismiss behaviour.
 */
const FocusStealingHost: React.FC<FocusStealingHostProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(true);

  return (
    <div tabIndex={-1} onMouseDown={(event) => event.currentTarget.focus()}>
      {open && (
        <QuerySourcePicker
          onSelect={onSelect}
          onDismiss={() => setOpen(false)}
        />
      )}
    </div>
  );
};

describe('<QuerySourcePicker />', () => {
  beforeEach(() => {
    setup();

    // Load the selectable databases
    Databases.Store.load([objectDatabase, urlDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('selects the clicked database inside a focus stealing host', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<FocusStealingHost onSelect={onSelect} />);

    // Click a database option
    await user.click(screen.getByText(objectDatabase.name));

    // The database is selected rather than the picker being
    // dismissed by the host stealing focus on mousedown
    expect(onSelect).toHaveBeenCalledWith(objectDatabase.id);
  });
});
