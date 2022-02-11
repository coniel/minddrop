import { setup, cleanup } from '../test-utils';
import { useTopicsStore } from '../useTopicsStore';
import { getTopicViews } from './getTopicViews';

describe('getTopicViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all registered views', () => {
    expect(getTopicViews()).toEqual(useTopicsStore.getState().views);
  });
});
