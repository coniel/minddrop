import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { topicContentToMarkdown } from './topicContentToMarkdown';
import { parseTopic } from '../parseTopic';

const markdown = `# Topic title

### Drop 1 title

Drop 1 text

---

## Column 2

### Drop 2 title

Drop 2 text

---

## Column 3

### Drop 3 title

Drop 3 text
`;

const topicContent = parseTopic(markdown);

describe('topicContentToMarkdown', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts the topic columns into markdown', () => {
    expect(topicContentToMarkdown(topicContent)).toEqual(markdown);
  });
});
