import { archiveSubtopics } from '../archiveSubtopics';
import { getTopic } from '../getTopic';
import { getTopics } from '../getTopics';
import { setup, cleanup, core, tSailing } from '../test-utils';
import { unarchiveSubtopics } from './unarchiveSubtopics';

const subtopicIds = tSailing.subtopics.slice(0, 2);

describe('unarchiveSubtopics', () => {
  beforeEach(() => {
    setup();

    // Archive the test subtopics
    archiveSubtopics(core, tSailing.id, subtopicIds);
  });

  afterEach(cleanup);

  it('unarchives the subtopics on the topic', () => {
    // Unarchive the subtopics
    unarchiveSubtopics(core, tSailing.id, subtopicIds);

    // Get updated topic
    const topic = getTopic(tSailing.id);
    // Should add subtopic IDs to 'subtopics'
    expect(topic.subtopics.includes(subtopicIds[0])).toBeTruthy();
    expect(topic.subtopics.includes(subtopicIds[1])).toBeTruthy();
    // Should remove subtopic IDs from 'archivedSubtopics'
    expect(topic.archivedSubtopics.includes(subtopicIds[0])).toBeFalsy();
    expect(topic.archivedSubtopics.includes(subtopicIds[1])).toBeFalsy();
  });

  it('returns the updated topic', () => {
    // Unarchive the subtopics
    const result = unarchiveSubtopics(core, tSailing.id, subtopicIds);

    // Should return updated topic
    expect(result).toEqual(getTopic(tSailing.id));
  });

  it('dispatches a `topics:unarchive-subtopics` event', (done) => {
    core.addEventListener('topics:unarchive-subtopics', (payload) => {
      // Get the updated topic
      const topic = getTopic(tSailing.id);
      // Get the unarchived subtopics
      const subtopics = getTopics(subtopicIds);

      // Payload should contain topic and subtopics
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Arhive the subtopics
    unarchiveSubtopics(core, tSailing.id, subtopicIds);
  });
});
