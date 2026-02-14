import { afterEach, describe, expect, it } from 'vitest';
import { Events, OpenMainContentViewEvent } from '@minddrop/events';
import { cleanup, render } from '@minddrop/test-utils';
import { OpenItemTypeViewEvent } from '../events';
import { ItemTypeFeature } from './ItemTypeFeature';

describe('<ItemTypeFeature />', () => {
  afterEach(cleanup);

  it('opens the item type view in main content', () =>
    new Promise<void>((resolve) => {
      render(<ItemTypeFeature />);

      Events.addListener<any>(OpenMainContentViewEvent, 'test', ({ data }) => {
        expect(data.props).toEqual({ type: 'example-type', tab: 'properties' });
        Events.removeListener(OpenMainContentViewEvent, 'test');
        resolve();
      });

      Events.dispatch(OpenItemTypeViewEvent, {
        type: 'example-type',
        tab: 'properties',
      });
    }));
});
