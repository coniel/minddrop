/**
 * The container constructs CommonMark and GFM provide. Each becomes an
 * ancestry frame rather than an element, keeping the document flat.
 */
export type FrameKind = 'blockquote' | 'list-item' | 'footnote-definition';

interface BaseFrame<TKind extends FrameKind> {
  /**
   * Identifies the container instance. Blocks sharing an id belong to the
   * same container, which is how a list item's continuation blocks stay
   * attached to it without a wrapping element.
   */
  id: string;

  /**
   * The container construct the frame represents.
   */
  kind: TKind;
}

/**
 * A block quote container.
 */
export interface BlockquoteFrame extends BaseFrame<'blockquote'> {
  /**
   * The line prefix as authored, either '>' or '> '.
   */
  syntax?: string;
}

/**
 * A list item container. Lists themselves are neither frames nor elements:
 * a list is the run of adjacent items sharing a marker, which is how
 * markdown itself decides where one list ends and the next begins.
 */
export interface ListItemFrame extends BaseFrame<'list-item'> {
  /**
   * Whether the item belongs to an ordered list.
   */
  ordered: boolean;

  /**
   * The marker as authored: '-', '*' or '+' for bullets, '.' or ')' for
   * ordered items.
   */
  marker: string;

  /**
   * The number as authored. CommonMark honours only the first item's number
   * as the list start, so '1. 1. 1.' and '1. 2. 3.' render identically but
   * are different bytes.
   */
  number?: number;

  /**
   * The task state for GFM task list items. Absent on plain items.
   */
  checked?: boolean;

  /**
   * The character between the checkbox brackets as authored, since a
   * checked box can be written with either case.
   */
  checkedSyntax?: string;

  /**
   * Whether the item is loose, meaning its blocks are separated by blank
   * lines.
   */
  spread?: boolean;

  /**
   * Indentation beyond what the item's containers already contribute. A
   * nested item is indented by its parent's continuation prefix, so this
   * only carries the extra whitespace an author added on top.
   */
  indent?: string;
}

/**
 * A footnote definition container.
 */
export interface FootnoteDefinitionFrame
  extends BaseFrame<'footnote-definition'> {
  /**
   * The normalized identifier references resolve against.
   */
  identifier: string;

  /**
   * The label as authored.
   */
  label?: string;
}

export type Frame = BlockquoteFrame | ListItemFrame | FootnoteDefinitionFrame;
