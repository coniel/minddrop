import { afterEach, beforeEach, describe, it } from 'vitest';
import { PageFixtures, Pages } from '@minddrop/pages';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { PageView } from './PageView';

const { page_1 } = PageFixtures;

describe('<PageView />', () => {
  beforeEach(() => {
    setup();

    // Load a page into the store
    Pages.Store.load([page_1]);
  });

  afterEach(cleanup);

  it('renders the page header', () => {
    render(<PageView pageId={page_1.id} />);

    // The page name is displayed
    screen.getByText(page_1.name);
  });

  it('renders the not found state for missing pages', () => {
    render(<PageView pageId="page_missing" />);

    screen.getByText('pages.view.notFound');
  });
});
