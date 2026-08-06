import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryTemplatesEditor } from './DatabaseEntryTemplatesEditor';

const { objectDatabase, entryTemplatesDatabase, entryTemplate1 } =
  DatabaseFixtures;

describe('<DatabaseEntryTemplatesEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('describes templates when the database has none', () => {
    render(
      <DatabaseEntryTemplatesEditor
        databaseId={objectDatabase.id}
        draftTemplates={[]}
        onSaveDraft={vi.fn()}
        onCancelDraft={vi.fn()}
      />,
    );

    expect(
      screen.getByText('databases.entryTemplates.empty'),
    ).toBeInTheDocument();
  });

  it('omits the description when the database has templates', () => {
    render(
      <DatabaseEntryTemplatesEditor
        databaseId={entryTemplatesDatabase.id}
        draftTemplates={[]}
        onSaveDraft={vi.fn()}
        onCancelDraft={vi.fn()}
      />,
    );

    expect(screen.queryByText('databases.entryTemplates.empty')).toBeNull();
    // The database's templates are listed
    expect(screen.getByText(entryTemplate1.name)).toBeInTheDocument();
  });

  it('omits the description while a draft template is open', () => {
    render(
      <DatabaseEntryTemplatesEditor
        databaseId={objectDatabase.id}
        draftTemplates={[{ draftId: 1 }]}
        onSaveDraft={vi.fn()}
        onCancelDraft={vi.fn()}
      />,
    );

    expect(screen.queryByText('databases.entryTemplates.empty')).toBeNull();
  });
});
