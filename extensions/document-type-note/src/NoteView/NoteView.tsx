import { useCallback, useMemo } from 'react';
import { Documents, DocumentViewProps } from '@minddrop/documents';
import { RichTextEditor } from '@minddrop/editor';
import { BlockElement } from '@minddrop/ast';
import { parseNoteContent } from '../parseNoteContent';
import './NoteView.css';

export const NoteView: React.FC<DocumentViewProps<BlockElement[]>> = ({
  document,
}) => {
  const initialContent = useMemo<BlockElement[]>(
    () => parseNoteContent(document.fileTextContent),
    [document.fileTextContent],
  );

  const onChange = useCallback(
    (value: BlockElement[]) => {
      Documents.update(document.path, { content: value });
    },
    [document.path],
  );

  return (
    <div className="note-view">
      <RichTextEditor
        key={document.path}
        initialValue={initialContent}
        onChangeDebounced={onChange}
      />
    </div>
  );
};
