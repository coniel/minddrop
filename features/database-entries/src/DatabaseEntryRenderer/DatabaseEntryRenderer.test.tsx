import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryRenderer } from './DatabaseEntryRenderer';

const { objectEntry1 } = DatabaseFixtures;
const { cardDesign1, cardDesign2 } = DesignFixtures;

describe('<DatabaseEntryRenderer />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders an entry using the default design', () => {
    render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} designType="card" />,
    );

    // Design fixture renders its ID as content
    screen.getByText(cardDesign1.id);
  });

  it('renders an entry using the specified design', () => {
    render(
      <DatabaseEntryRenderer
        entryId={objectEntry1.id}
        designType="card"
        designId={cardDesign2.id}
      />,
    );

    // Design fixture renders its ID as content
    screen.getByText(cardDesign2.id);
  });

  it('returns null if the entry does not exist', () => {
    const { container } = render(
      <DatabaseEntryRenderer entryId="non-existent-entry" designType="card" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
