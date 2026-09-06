import { useState } from 'react';
import './CommentEditor.css';

interface CommentEditorProps {
  /**
   * Placeholder shown in the empty textarea.
   */
  placeholder: string;

  /**
   * Called with the trimmed text when the comment is submitted.
   */
  onSubmit: (text: string) => void;

  /**
   * Called when editing is cancelled.
   */
  onCancel: () => void;
}

/**
 * Renders a textarea with save and cancel actions for writing a review
 * comment. Cmd+Enter saves and Escape cancels.
 */
export const CommentEditor: React.FC<CommentEditorProps> = ({
  placeholder,
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState('');

  // Whether there is anything to submit
  const canSubmit = text.trim().length > 0;

  // Submit the trimmed text, ignoring blank input
  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(text.trim());
  };

  // Save on Cmd+Enter, cancel on Escape
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  // Track the typed text
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="comment-editor">
      <textarea
        className="comment-editor-textarea"
        value={text}
        placeholder={placeholder}
        autoFocus
        spellCheck={false}
        rows={4}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <div className="comment-editor-actions">
        <button className="comment-editor-button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="comment-editor-button primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          title="Save (Cmd+Enter)"
        >
          Save
        </button>
      </div>
    </div>
  );
};
