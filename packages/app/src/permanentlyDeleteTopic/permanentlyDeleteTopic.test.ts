import { TopicNotFoundError, Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { ViewInstanceNotFoundError, Views } from '@minddrop/views';
import { cleanup, core, setup } from '../test-utils';
import { permanentlyDeleteTopic } from './permanentlyDeleteTopic';

const { tSailing } = TOPICS_TEST_DATA;

describe('permanentlyDeleteTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the topic', () => {
    permanentlyDeleteTopic(core, tSailing.id);

    expect(() => Topics.get(tSailing.id)).toThrowError(TopicNotFoundError);
  });

  it("deletes the topic's views", () => {
    permanentlyDeleteTopic(core, tSailing.id);

    expect(() => Views.getInstance(tSailing.views[0])).toThrowError(
      ViewInstanceNotFoundError,
    );
  });

  it('returns the deleted topic', () => {
    const topic = permanentlyDeleteTopic(core, tSailing.id);

    expect(topic).toEqual(tSailing);
  });
});
