import { describe, it, expect, vi } from 'vitest';
import { initializeTopicContent } from './initializeTopicContent';
import { Topic_1 } from '../test-utils';

vi.mock('uuid', () => ({
  v4: () => 'uuid',
}));

describe('initializeTopicContent', () => {
  it('returns a TopicContent object with three empty columns', () => {
    const content = initializeTopicContent(Topic_1);

    // Should have a title
    expect(content.title).toEqual(Topic_1.title);
    // Should generate markdown
    expect(content.markdown).toBe(`# ${Topic_1.title}\n\n---\n\n---\n\n`);
    // Should generate columns
    expect(content.columns).toEqual([
      { id: 'uuid', drops: [] },
      { id: 'uuid', seperator: '---', drops: [] },
      { id: 'uuid', seperator: '---', drops: [] },
    ]);
  });
});
