import { MockDate } from '@minddrop/test-utils';
import { Topics } from '@minddrop/topics';
import { ViewInstances } from '@minddrop/views';
import { cleanup, core, setup } from '../test-utils';
import { createTopic } from './createTopic';

describe('createTopic', () => {
  beforeAll(() => {
    MockDate.set('01/01/2020');
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(setup);

  afterEach(cleanup);

  it('creates the topic', () => {
    const topic = createTopic(core);

    expect(Topics.get(topic.id)).toBeDefined();
  });

  it('create a default view for the topic', () => {
    const topic = createTopic(core);

    expect(ViewInstances.get(topic.views[0])).toBeDefined();
  });
});
