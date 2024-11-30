import { ParentDirProvider, mapPropsToClasses } from '@minddrop/utils';
import { useDocument } from '../../useDocument';
import { DocumentViewsRenderer } from '../DocumentViewsRenderer';
import { Fs } from '@minddrop/file-system';

interface DocumentRendererProps extends React.HTMLProps<HTMLDivElement> {
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
