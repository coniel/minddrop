import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { AddContentMenu, AddedContent } from './AddContentMenu';

const { objectDatabase, objectEntry1, entryTemplate1, entryTemplatesDatabase } =
  DatabaseFixtures;

// An entry modified after everything the fixtures carry, so it
// fills the recent list. Its title is one no other entry shares.
const recentEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_recent',
  title: 'Recent entry',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

describe('<AddContentMenu />', () => {
  beforeEach(() => {
    setup();

    DatabaseEntries.Store.load([recentEntry]);
  });

  afterEach(cleanup);

  function init(props: Partial<React.ComponentProps<typeof AddContentMenu>>) {
    const added: AddedContent[] = [];
    const secondaryAdded: AddedContent[] = [];

    render(
      <AddContentMenu
        onAdd={(content) => added.push(content)}
        onSecondaryAdd={(content) => secondaryAdded.push(content)}
        {...props}
      />,
    );

    return { added, secondaryAdded };
  }

  // Picks an item with shift held, making it a secondary selection
  async function shiftPick(text: string) {
    const user = userEvent.setup();

    await user.keyboard('{Shift>}');
    await user.click(screen.getByText(text));
    await user.keyboard('{/Shift}');
  }

  // The name a template is listed under. The entry name it creates
  // qualifies it.
  const templateLabel = `${entryTemplatesDatabase.entryName} · ${entryTemplate1.name}`;

  function search(query: string) {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: query },
    });
  }

  it('offers every database as a way to create an entry', () => {
    init({});

    expect(screen.getByText(objectDatabase.entryName)).toBeInTheDocument();
  });

  it('lists the suggested databases and templates first', () => {
    init({ suggested: [entryTemplate1.id, objectDatabase.id] });

    const listed = screen
      .getAllByRole('menuitem')
      .map((item) => item.textContent);

    expect(listed.slice(0, 2)).toEqual([
      templateLabel,
      objectDatabase.entryName,
    ]);
  });

  it('leaves a suggested database out of the remaining ones', () => {
    init({ suggested: [objectDatabase.id] });

    expect(screen.getAllByText(objectDatabase.entryName)).toHaveLength(1);
  });

  it('offers no templates among the remaining databases', () => {
    init({});

    expect(screen.queryByText(templateLabel)).toBeNull();
  });

  it('lists the most recent entries', () => {
    init({});

    expect(screen.getByText(recentEntry.title)).toBeInTheDocument();
  });

  it('lists no more entries than the limit', () => {
    init({ limit: 1 });

    // Only the newest entry fills a list of one
    expect(screen.getAllByText(recentEntry.title)).toHaveLength(1);
    expect(screen.queryByText(objectEntry1.title)).toBeNull();
  });

  it('leaves out the entries the consumer already holds', () => {
    init({ excludeIds: [recentEntry.id] });

    expect(screen.queryByText(recentEntry.title)).toBeNull();
  });

  it('searches databases and entry templates', () => {
    init({});

    search(entryTemplate1.name);

    expect(screen.getByText(templateLabel)).toBeInTheDocument();
  });

  it('searches the entries which already exist', () => {
    init({});

    search(recentEntry.title);

    expect(screen.getByText(recentEntry.title)).toBeInTheDocument();
  });

  it('leaves out what the consumer holds from the search too', () => {
    init({ excludeIds: [recentEntry.id] });

    search(recentEntry.title);

    expect(screen.queryByText(recentEntry.title)).toBeNull();
  });

  it('hands over a picked entry as one which already existed', async () => {
    const { added } = init({});

    await userEvent.click(screen.getByText(recentEntry.title));

    expect(added).toEqual([{ id: recentEntry.id, created: false }]);
  });

  it('hands a shift-picked entry to the secondary handler', async () => {
    const { added, secondaryAdded } = init({});

    await shiftPick(recentEntry.title);

    expect(secondaryAdded).toEqual([{ id: recentEntry.id, created: false }]);
    expect(added).toEqual([]);
  });

  it('clears the search after a secondary pick', async () => {
    init({});

    search(recentEntry.title);
    await shiftPick(recentEntry.title);

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('creates an entry in the picked database', async () => {
    const { added } = init({});

    await userEvent.click(screen.getByText(objectDatabase.entryName));

    expect(added[0].created).toBe(true);
    expect(DatabaseEntries.get(added[0].id).database).toBe(objectDatabase.id);
  });

  it('creates an entry from the picked template', async () => {
    const { added } = init({ suggested: [entryTemplate1.id] });

    await userEvent.click(screen.getByText(templateLabel));

    expect(added[0].created).toBe(true);
    expect(DatabaseEntries.get(added[0].id).title).toBe(
      entryTemplate1.defaultTitle,
    );
  });
});
