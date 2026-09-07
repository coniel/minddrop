import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DataViewsView } from './DataViewsView';

const { dataView_gallery_1 } = DataViewFixtures;

describe('<DataViewsView />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    await cleanup();
  });

  it('lists the persisted data views', () => {
    render(<DataViewsView />);

    screen.getByText(dataView_gallery_1.name);
  });

  it("opens a view's settings menu from its list item", () => {
    render(<DataViewsView />);

    fireEvent.contextMenu(screen.getByText(dataView_gallery_1.name));

    expect(
      screen.getByDisplayValue(dataView_gallery_1.name),
    ).toBeInTheDocument();
  });
});
