import { useDocument } from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';
import { ParentDirProvider, mapPropsToClasses } from '@minddrop/utils';
import { DocumentViewsRenderer } from '../DocumentViewsRenderer';
import './DocumentRenderer.css';

export interface DocumentRendererProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The document ID.
   */
  id: string;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  id,
  className,
  ...other
}) => {
  const document = useDocument(id);

  if (!document) {
    return <div>Document {id} not found</div>;
  }

  return (
    <ParentDirProvider value={Fs.parentDirPath(document.path)}>
      <div
        className={mapPropsToClasses({ className }, 'document-renderer')}
        {...other}
      >
        <DocumentViewsRenderer document={document} />
      </div>
    </ParentDirProvider>
  );
};
