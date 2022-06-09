import { setup, cleanup, core, tSailing } from '../test-utils';
import { TopicsResource } from '../TopicsResource';
import { archiveSubtopics } from './archiveSubtopics';

describe('archiveSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('archives the subtopics on the topic', () => {
    const subtopicIds = tSailing.subtopics.slice(0, 2);

    // Archive the subtopics
    archiveSubtopics(core, tSailing.id, subtopicIds);

    // Get updated topic
    const topic = TopicsResource.get(tSailing.id);
    // Should add subtopic IDs to 'archviedSubtopics'
    expect(topic.archivedSubtopics.includes(subtopicIds[0])).toBeTruthy();
    expect(topic.archivedSubtopics.includes(subtopicIds[1])).toBeTruthy();
    // Should remove subtopic IDs from 'subtopics'
    expect(topic.subtopics.includes(subtopicIds[0])).toBeFalsy();
    expect(topic.subtopics.includes(subtopicIds[1])).toBeFalsy();
  });

  it('returns the updated topic', () => {
    const subtopicIds = tSailing.subtopics.slice(0, 2);

    // Archive the subtopics
    const result = archiveSubtopics(core, tSailing.id, subtopicIds);

    // Should return updated topic
    expect(result).toEqual(TopicsResource.get(tSailing.id));
  });

  it('dispatches a `topics:topic:archive-subtopics` event', (done) => {
    const subtopicIds = tSailing.subtopics.slice(0, 2);

    core.addEventListener('topics:topic:archive-subtopics', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSailing.id);
      // Get the archived subtopics
      const subtopics = TopicsResource.get(subtopicIds);

      // Payload should contain topic and subtopics
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Arhive the subtopics
    archiveSubtopics(core, tSailing.id, subtopicIds);
  });
});
