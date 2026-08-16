import React, { useContext } from 'react';
import { useSlateStatic } from 'slate-react';
import { Element, ListItemFrame } from '@minddrop/ast';
import { useTranslation } from '@minddrop/i18n';
import { Icon, propsToClass } from '@minddrop/ui-primitives';
import { BlockFramesContext } from '../BlockFramesContext';
import { toggleTaskItem } from '../toggleTaskItem';
import { RenderedFrame, hasBlockId } from '../utils';
import './BlockFrames.css';

export interface BlockFramesProps {
  /**
   * The block being rendered inside its containers.
   */
  element: Element;

  /**
   * The rendered block.
   */
  children: React.ReactNode;
}

/**
 * Renders a block inside the containers it sits in, drawing each one's
 * indentation and affordances.
 */
export const BlockFrames: React.FC<BlockFramesProps> = ({
  element,
  children,
}) => {
  const blockFrames = useContext(BlockFramesContext);
  const frames = hasBlockId(element) ? blockFrames.get(element.id) : undefined;

  // A block with no containers is rendered as it is
  if (!frames?.length) {
    return children;
  }

  return (
    <div
      className={propsToClass('block-frames', {
        checked: isCompletedTask(frames),
      })}
      style={{ paddingInlineStart: resolveIndent(frames.length) }}
    >
      {frames.map((frame, depth) => (
        <BlockFrameAffordance
          key={frame.frame.id}
          renderedFrame={frame}
          depth={depth}
        />
      ))}
      {children}
    </div>
  );
};

interface BlockFrameAffordanceProps {
  /**
   * The container being drawn.
   */
  renderedFrame: RenderedFrame;

  /**
   * The container's ancestry depth, which decides the column it is drawn in.
   */
  depth: number;
}

/**
 * Renders the affordance a single container draws alongside the block: a
 * quote bar, a list marker, or a footnote label.
 */
const BlockFrameAffordance: React.FC<BlockFrameAffordanceProps> = ({
  renderedFrame,
  depth,
}) => {
  const { frame, isFirstBlock, isLastBlock } = renderedFrame;
  const style = { insetInlineStart: resolveIndent(depth) };

  // A quote is marked on every one of its lines, so its bar is drawn by
  // each of its blocks and bridges the gap to the next one
  if (frame.kind === 'blockquote') {
    return (
      <span
        contentEditable={false}
        className={propsToClass('block-frame-quote-bar', {
          last: isLastBlock,
          className: 'block-frame-affordance',
        })}
        style={style}
      />
    );
  }

  // A container's marker belongs to the block which opens it, so its
  // continuation blocks indent without repeating it
  if (!isFirstBlock) {
    return null;
  }

  if (frame.kind === 'footnote-definition') {
    return (
      <span
        contentEditable={false}
        className="block-frame-affordance block-frame-footnote-label"
        style={style}
      >
        [^{frame.label ?? frame.identifier}]
      </span>
    );
  }

  return (
    <ListItemMarker frame={frame} number={renderedFrame.number} style={style} />
  );
};

interface ListItemMarkerProps {
  /**
   * The list item being marked.
   */
  frame: ListItemFrame;

  /**
   * The number displayed by an ordered item.
   */
  number?: number;

  /**
   * Positions the marker in its container's column.
   */
  style: React.CSSProperties;
}

/**
 * Renders a list item's marker: a checkbox for a task item, its number for
 * an ordered item, and a bullet otherwise.
 */
const ListItemMarker: React.FC<ListItemMarkerProps> = ({
  frame,
  number,
  style,
}) => {
  const { t } = useTranslation({ keyPrefix: 'editor.frames' });
  const editor = useSlateStatic();

  const handleCheckboxClick = () => {
    toggleTaskItem(editor, frame.id);
  };

  if (frame.checked !== undefined) {
    return (
      <span
        contentEditable={false}
        className={propsToClass('block-frame-task-checkbox', {
          checked: frame.checked,
          className: 'block-frame-affordance',
        })}
        style={style}
      >
        <Icon
          role="button"
          aria-label={t('taskItem')}
          name={frame.checked ? 'square-check-big' : 'square'}
          onClick={handleCheckboxClick}
        />
      </span>
    );
  }

  if (frame.ordered) {
    return (
      <span
        contentEditable={false}
        className="block-frame-affordance block-frame-number"
        style={style}
      >
        {number ?? frame.number ?? 1}
        {frame.marker}
      </span>
    );
  }

  return (
    <span
      contentEditable={false}
      className="block-frame-affordance block-frame-bullet"
      style={style}
    />
  );
};

/**
 * Returns the width a number of containers indent their content by.
 *
 * @param depth - The number of containers.
 * @returns The indent as a CSS length.
 */
function resolveIndent(depth: number): string {
  return `calc(var(--block-frame-indent) * ${depth})`;
}

/**
 * Checks whether a block is content of a ticked off task item.
 *
 * Only the item's own blocks count, so an item nested inside a ticked one
 * keeps the state it was given rather than inheriting its parent's.
 *
 * @param frames - The containers the block sits inside.
 * @returns Whether the block belongs to a completed task.
 */
function isCompletedTask(frames: RenderedFrame[]): boolean {
  const { frame } = frames[frames.length - 1];

  return frame.kind === 'list-item' && frame.checked === true;
}
