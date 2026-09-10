import { FontLetterBand } from '@minddrop/ui-designs-next';

/**
 * The room kept around a line for the accents and descenders which
 * reach past the letters' band, as a share of the font size. Sits
 * inside the line's own box, so the single line's clipping does not
 * cut them.
 */
const ClipRoom = 0.3;

/**
 * The room kept to either side of a line for the letters which lean
 * or curve past their width, italics above all, as a share of the
 * font size.
 */
const SideClipRoom = 0.15;

/**
 * Resolves the styles which fit a line of heading text to its
 * block: the font sized so the letters' band fills the block's
 * height, the line lifted onto the block's top edge, and the room
 * the accents and descenders need held outside the block.
 *
 * @param blockHeight - The block's height in pixels.
 * @param band - The band the heading font's letters occupy.
 * @returns The heading text's styles.
 */
export function resolveHeadingTextStyle(
  blockHeight: number,
  band: FontLetterBand,
): React.CSSProperties {
  // The size at which a line of letters fills the block
  const fontSize = blockHeight / band.height;

  return {
    fontSize,
    // Wrapped lines take a block height each
    lineHeight: `${blockHeight}px`,
    paddingBlock: fontSize * ClipRoom,
    // The lift, with the room below the line pulled back in so the
    // text still takes the block's height.
    marginTop: -fontSize * (band.lift + ClipRoom),
    marginBottom: fontSize * (band.lift - ClipRoom),
    // Room to either side, taken back out of the layout so the text
    // still takes the block's width.
    paddingInline: fontSize * SideClipRoom,
    marginInline: -fontSize * SideClipRoom,
  };
}
