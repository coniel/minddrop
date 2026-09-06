import { describe, expect, it } from 'vitest';
import { getLoadedEmojiData, loadEmojiData } from './loadEmojiData';

describe('loadEmojiData', () => {
  it('loads and caches the emoji data', async () => {
    const data = await loadEmojiData();

    // The data contains the unminified emoji
    expect(data.all.length).toBeGreaterThan(0);

    // The data contains the pre-grouped emoji
    expect(data.grouped.length).toBeGreaterThan(0);

    // Searching matches emoji by label
    expect(data.search('cat').length).toBeGreaterThan(0);

    // Loading again reuses the cached result
    expect(await loadEmojiData()).toBe(data);

    // The data is available synchronously once loaded
    expect(getLoadedEmojiData()).toBe(data);
  });
});
