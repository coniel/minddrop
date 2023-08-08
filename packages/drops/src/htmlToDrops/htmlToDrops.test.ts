import { describe, it, expect } from 'vitest';
import { htmlToDrops } from './htmlToDrops';

const html = `
<p>Drop 1</p>

<h3>Drop 2 title</h3>

<p>Drop 2</p>
`;

describe('htmlToDrops', () => {
  it('parses HTML into drops', () => {
    // Convert HTML into drops
    const drops = htmlToDrops(html);

    // Should return 2 drops
    expect(drops.length).toBe(2);

    // Drops should be split by H3
    expect(drops[0].markdown).toBe('Drop 1\n');
    expect(drops[1].markdown).toBe('### Drop 2 title\n\nDrop 2\n');
  });
});
