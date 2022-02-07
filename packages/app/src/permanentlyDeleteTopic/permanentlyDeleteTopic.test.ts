import { TopicNotFoundError, Topics } from '@minddrop/topics';
import { ViewInstanceNotFoundError, Views } from '@minddrop/views';
import { cleanup, core, setup, topic1 } from '../tests';
import { permanentlyDeleteTopic } from './permanentlyDeleteTopic';

describe('permanentlyDeleteTopic', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
  });

  it('deletes the topic', () => {
    permanentlyDeleteTopic(core, topic1.id);

    expect(() => Topics.get(topic1.id)).toThrowError(TopicNotFoundError);
  });

  it("deletes the topic's views", () => {
    permanentlyDeleteTopic(core, topic1.id);

    expect(() => Views.getInstance(topic1.views[0])).toThrowError(
      ViewInstanceNotFoundError,
    );
  });

  it('returns the deleted topic', () => {
    const topic = permanentlyDeleteTopic(core, topic1.id);

    expect(topic).toEqual(topic1);
  });
});
