import { CommentEditor } from './CommentEditor';
import './CommentPopover.css';

interface CommentPopoverProps {
  /**
   * Label describing what the comment is anchored to.
   */
  label: string;

  /**
   * Positioning styles placing the popover within the editor container.
   */
  style: React.CSSProperties;

  /**
   * Called with the comment text when saved.
   */
  onSubmit: (text: string) => void;

  /**
   * Called when the popover is dismissed without saving.
   */
  onCancel: () => void;
}

/**
 * Renders a floating comment editor anchored to a code selection or a
 * file.
 */
export const CommentPopover: React.FC<CommentPopoverProps> = ({
  label,
  style,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="comment-popover" style={style}>
      <div className="comment-popover-range">{label}</div>

      <CommentEditor
        placeholder="Write a review comment"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};
