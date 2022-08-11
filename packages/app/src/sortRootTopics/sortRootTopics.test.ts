import { setup, cleanup, core } from '../test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { sortRootTopics } from './sortRootTopics';
import { InvalidParameterError } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';

const { rootTopicIds } = TOPICS_TEST_DATA;

describe('sortRootTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the provided topic IDs do not match root topic IDs', () => {
    // Call with topic IDs which do not match the
    // root topic IDs.
    expect(() =>
      sortRootTopics(core, [
        // Remove the first root topic ID
        ...rootTopicIds.slice(1),
        // Add an extra topic ID
        'other-topic',
      ]),
    ).toThrowError(InvalidParameterError);

    // Call with topic IDs which are missing a
    // root topic ID.
    expect(() => sortRootTopics(core, [...rootTopicIds.slice(1)])).toThrowError(
      InvalidParameterError,
    );

    // Call with topic IDs which contain an
    // extra topic ID.
    expect(() =>
      sortRootTopics(core, [...rootTopicIds, 'extra-topic']),
    ).toThrowError(InvalidParameterError);
  });

  it('sets the new order in the app store', () => {
    // The new root topic order. Move the first
    // topic to the end.
    const newOrder = [...rootTopicIds.slice(1), rootTopicIds[0]];

    // Sort the root topics
    sortRootTopics(core, newOrder);

    // Get the updated root topics from the store
    const updated = useAppStore.getState().rootTopics;

    // Root topic order should be updated
    expect(updated).toEqual(newOrder);
  });

  it('dispatches a `app:root-topics:sort` event', (done) => {
    // The new root topic order. Move the first
    // topic to the end.
    const newOrder = [...rootTopicIds.slice(1), rootTopicIds[0]];

    // Listen to 'app:root-topics:sort' events
    core.addEventListener('app:root-topics:sort', (payload) => {
      // Payload data should be the new root topic order
      expect(payload.data).toEqual(newOrder);
      done();
    });

    // Sort the root topics
    sortRootTopics(core, newOrder);
  });
});
