import { createContext } from 'react';
import { BlockFrames } from '../utils';

/**
 * How each block's containers are drawn, keyed by block ID.
 *
 * Provided as context rather than resolved within each block, because a
 * frame is drawn from the blocks around it: whether a block opens its
 * container, and which number an ordered item takes, both change when a
 * block elsewhere in the document moves.
 */
export const BlockFramesContext = createContext<BlockFrames>(new Map());
