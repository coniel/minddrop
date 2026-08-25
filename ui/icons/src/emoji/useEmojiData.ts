import { useEffect, useState } from 'react';
import { EmojiData } from '../types';
import { getLoadedEmojiData, loadEmojiData } from './loadEmojiData';

/**
 * Returns the emoji data, triggering its load on first use.
 * Returns null until the data has loaded.
 *
 * @returns The emoji data or null while loading.
 */
export function useEmojiData(): EmojiData | null {
  // Start from the already loaded data when available
  const [data, setData] = useState(getLoadedEmojiData());

  useEffect(() => {
    // Trigger the load, a no-op once the data is loaded or loading
    loadEmojiData().then(setData);
  }, []);

  return data;
}
