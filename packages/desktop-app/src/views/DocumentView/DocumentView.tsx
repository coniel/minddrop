import { Documents, useDocument } from '@minddrop/documents';
import { RichTextEditor, EditorElements, EditorMarks } from '@minddrop/editor';
import { useCallback, useMemo } from 'react';
import { Ast, BlockElement, ParagraphElement } from '@minddrop/ast';
import './DocumentView.css';

export interface DocumentViewProps {
  /**
   * The document path.
   */
  path: string;
}

EditorElements.registerDefaults();
EditorMarks.registerDefaults();
Ast.registerDefaultConfigs();

export const DocumentView: React.FC<DocumentViewProps> = ({ path }) => {
  const document = useDocument(path);

  const initialContent = useMemo<BlockElement[]>(() => {
    return document?.fileTextContent
      ? Ast.fromMarkdown(document.fileTextContent)
      : [
          Ast.generateBlockElement<ParagraphElement>('paragraph', {
            children: [{ text: '' }],
          }),
        ];
  }, [document]);

  const onChange = useCallback(
    (value: BlockElement[]) => {
      Documents.updateContent(path, Ast.toMarkdown(value));
    },
    [path],
  );

  return (
    <div className="document-view">
      <RichTextEditor
        key={path}
        initialValue={initialContent}
        onChangeDebounced={onChange}
      />
    </div>
  );
};
