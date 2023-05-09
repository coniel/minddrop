import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, Topic_1_2_1, Topic_1 } from '../test-utils';
import { topicTitleFromPath } from './topicTitleFromPath';

describe('topicTitleFromPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('parses title from markdown file name', () => {
    // Topic 1.2.1 is a file
    expect(topicTitleFromPath(Topic_1_2_1.path)).toBe(Topic_1_2_1.title);
  });

  it('parses title from directory name', () => {
    // Topic 1 is a directory
    expect(topicTitleFromPath(Topic_1.path)).toBe(Topic_1.title);
  });
});
