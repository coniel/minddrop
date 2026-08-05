import { afterEach, beforeEach, describe, it } from 'vitest';
import { SpaceFixtures, Spaces } from '@minddrop/spaces';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { SpaceView } from './SpaceView';

const { space_1 } = SpaceFixtures;

describe('<SpaceView />', () => {
  beforeEach(() => {
    setup();

    // Load a space into the store
    Spaces.Store.load([space_1]);
  });

  afterEach(cleanup);

  it('renders the edit mode toggle', () => {
    render(<SpaceView spaceId={space_1.id} />);

    // The edit mode toggle button is displayed
    screen.getByLabelText('spaces.view.actions.edit');
  });

  it('renders the not found state for missing spaces', () => {
    render(<SpaceView spaceId="space_missing" />);

    screen.getByText('spaces.view.notFound');
  });
});
