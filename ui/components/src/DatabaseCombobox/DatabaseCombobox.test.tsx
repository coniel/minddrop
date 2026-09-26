import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Database, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseCombobox, DatabaseComboboxProps } from './DatabaseCombobox';

const { objectDatabase, urlDatabase } = DatabaseFixtures;

interface HarnessProps
  extends Partial<Omit<DatabaseComboboxProps, 'value' | 'onValueChange'>> {
  /**
   * The initially selected database's ID.
   */
  initialValue?: string | null;
}

/**
 * Renders the combobox with its selection kept in state. Also renders
 * the selected database's ID for assertions.
 */
const Harness: React.FC<HarnessProps> = ({ initialValue = null, ...props }) => {
  // The selected database's ID
  const [value, setValue] = useState<string | null>(initialValue);

  return (
    <>
      {/* The combobox */}
      <DatabaseCombobox value={value} onValueChange={setValue} {...props} />

      {/* The selected database's ID */}
      <output data-testid="selected">{value ?? ''}</output>
    </>
  );
};

describe('<DatabaseCombobox />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('selects the picked database', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    // Open the popup and pick a database
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: urlDatabase.name }));

    expect(screen.getByTestId('selected')).toHaveTextContent(urlDatabase.id);
  });

  it('shows the selected database', () => {
    render(<Harness initialValue={objectDatabase.id} />);

    expect(screen.getByRole('combobox')).toHaveTextContent(objectDatabase.name);
  });

  it('lists the databases alphabetically', async () => {
    const user = userEvent.setup();
    // The database names, alphabetically
    const names = Databases.getAll()
      .map((database) => database.name)
      .sort((nameA, nameB) => nameA.localeCompare(nameB));

    render(<Harness />);

    // Open the popup
    await user.click(screen.getByRole('combobox'));

    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(names);
  });

  it('lists only the given databases', async () => {
    const user = userEvent.setup();
    const databases: Database[] = [urlDatabase];

    render(<Harness databases={databases} />);

    // Open the popup
    await user.click(screen.getByRole('combobox'));

    expect(
      screen.getByRole('option', { name: urlDatabase.name }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: objectDatabase.name }),
    ).not.toBeInTheDocument();
  });

  it('clears the selection with the none option', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={objectDatabase.id} allowNone />);

    // Open the popup and pick the none option
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'None' }));

    expect(screen.getByTestId('selected')).toHaveTextContent('');
  });

  it('shows None while nothing is selected when none is allowed', () => {
    render(<Harness allowNone />);

    expect(screen.getByRole('combobox')).toHaveTextContent('None');
  });

  it('lists no none option unless allowed', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    // Open the popup
    await user.click(screen.getByRole('combobox'));

    expect(
      screen.getByRole('option', { name: objectDatabase.name }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'None' }),
    ).not.toBeInTheDocument();
  });
});
