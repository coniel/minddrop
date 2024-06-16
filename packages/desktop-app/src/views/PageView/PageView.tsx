import { Pages, usePage } from '@minddrop/pages';
import { RichTextEditor, EditorElements, EditorMarks } from '@minddrop/editor';
import { useCallback, useMemo } from 'react';
import { Ast, BlockElement, ParagraphElement } from '@minddrop/ast';
import './PageView.css';

export interface PageViewProps {
  /**
   * The page path.
   */
  path: string;
}

EditorElements.registerDefaults();
EditorMarks.registerDefaults();
Ast.registerDefaultConfigs();

export const PageView: React.FC<PageViewProps> = ({ path }) => {
  const page = usePage(path);

  const initialContent = useMemo<BlockElement[]>(() => {
    return page?.contentRaw
      ? Ast.fromMarkdown(page.contentRaw)
      : [
          Ast.generateBlockElement<ParagraphElement>('paragraph', {
            children: [{ text: '' }],
          }),
        ];
  }, [page]);

  const onChange = useCallback(
    (value: BlockElement[]) => {
      Pages.writeContent(path, Ast.toMarkdown(value));
    },
    [path],
  );

  return (
    <div className="page-view">
      <RichTextEditor
        key={path}
        initialValue={initialContent}
        onChangeDebounced={onChange}
      />
    </div>
  );
};
