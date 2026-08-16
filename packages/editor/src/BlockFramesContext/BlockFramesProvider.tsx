import React, { useMemo } from 'react';
import { useSlate } from 'slate-react';
import { Element } from '@minddrop/ast';
import { resolveBlockFrames, resolveBlockFramesSignature } from '../utils';
import { BlockFramesContext } from './BlockFramesContext';

export interface BlockFramesProviderProps {
  /**
   * The editor content the frames are provided to.
   */
  children: React.ReactNode;
}

/**
 * Provides the editor's blocks with the containers they are drawn inside.
 */
export const BlockFramesProvider: React.FC<BlockFramesProviderProps> = ({
  children,
}) => {
  const editor = useSlate();
  const elements = editor.children as Element[];

  // Resolved against a signature of the document's frames rather than
  // against the document itself, so that typing into a block, which
  // re-renders this provider without changing any frame, does not
  // re-render every framed block along with it.
  const signature = resolveBlockFramesSignature(elements);
  const blockFrames = useMemo(
    () => resolveBlockFrames(elements),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature],
  );

  return (
    <BlockFramesContext.Provider value={blockFrames}>
      {children}
    </BlockFramesContext.Provider>
  );
};
