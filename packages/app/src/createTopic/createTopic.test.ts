import { Topics } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { cleanup, core, setup } from '../tests';
import { createTopic } from './createTopic';

describe('createTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the topic', () => {
    const topic = createTopic(core);

    expect(Topics.get(topic.id)).toEqual(topic);
  });

  it('create a default view for the topic', () => {
    const topic = createTopic(core);

    expect(Views.getInstance(topic.views[0])).toBeDefined();
  });
});
