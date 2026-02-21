import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { objectDatabase } from '@minddrop/databases/src/test-utils/fixtures';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryRenderer } from './DatabaseEntryRenderer';

const { objectEntry1 } = DatabaseFixtures;
const { design_card_1, design_list_1 } = DesignFixtures;

describe('<DatabaseEntryRenderer />', () => {
  beforeEach(() => {
    setup();

    // Add designs to the database
    Databases.Store.update(objectDatabase.id, {
      designs: [design_card_1, design_list_1],
    });
  });

  afterEach(cleanup);

  it('renders an entry using the default design', () => {
    render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} designType="card" />,
    );

    // Design fixture renders its ID as content
    screen.getByText(design_card_1.id);
  });

  it('renders an entry using the specified design', () => {
    render(
      <DatabaseEntryRenderer
        entryId={objectEntry1.id}
        designType="list"
        designId={design_list_1.id}
      />,
    );

    // Design fixture renders its ID as content
    screen.getByText(design_list_1.id);
  });

  it('returns null if the entry does not exist', () => {
    const { container } = render(
      <DatabaseEntryRenderer entryId="non-existent-entry" designType="card" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
