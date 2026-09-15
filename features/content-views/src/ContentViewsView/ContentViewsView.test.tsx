import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ContentViewsView } from './ContentViewsView';

const { contentView_gallery_1 } = ContentViewFixtures;

describe('<ContentViewsView />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    await cleanup();
  });

  it('lists the persisted content views', () => {
    render(<ContentViewsView />);

    screen.getByText(contentView_gallery_1.name);
  });

  it("opens a view's settings menu from its list item", () => {
    render(<ContentViewsView />);

    fireEvent.contextMenu(screen.getByText(contentView_gallery_1.name));

    expect(
      screen.getByDisplayValue(contentView_gallery_1.name),
    ).toBeInTheDocument();
  });
});
