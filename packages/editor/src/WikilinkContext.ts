import { createContext } from 'react';

/**
 * Opens what a wikilink references.
 *
 * Provided as context because a wikilink is rendered deep within a block's
 * content, and because the editor itself has no idea what a reference names:
 * following one is the consumer's to do.
 */
export const WikilinkContext = createContext<
  ((reference: string) => void) | undefined
>(undefined);
