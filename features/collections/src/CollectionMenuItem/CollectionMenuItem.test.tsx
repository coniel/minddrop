import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { Events } from '@minddrop/events';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { OpenCollectionsViewEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { CollectionMenuItem } from './CollectionMenuItem';

const { collection_1 } = CollectionFixtures;

describe('<CollectionMenuItem />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the collection by name', () => {
    render(<CollectionMenuItem collectionId={collection_1.id} />);

    expect(screen.getByText(collection_1.name)).toBeInTheDocument();
  });

  it('renders nothing for a collection which does not exist', () => {
    const { container } = render(
      <CollectionMenuItem collectionId="collection_missing" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('opens the collections view showing the collection when clicked', () =>
    new Promise<void>((done) => {
      Events.addListener(OpenCollectionsViewEvent, 'test', (data) => {
        expect(data?.collectionId).toBe(collection_1.id);
        Events.removeListener(OpenCollectionsViewEvent, 'test');
        done();
      });

      render(<CollectionMenuItem collectionId={collection_1.id} />);

      userEvent.click(screen.getByText(collection_1.name));
    }));
});
