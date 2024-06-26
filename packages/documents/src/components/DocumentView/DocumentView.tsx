import { mapPropsToClasses } from '@minddrop/utils';
import { useDocument } from '../../useDocument';
import { useDocumentTypeConfig } from '../../useDocumentTypeConfig';

interface DocumentViewProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The document path.
   */
  path: string;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  path,
  className,
  ...other
}) => {
  const document = useDocument(path);
  const config = useDocumentTypeConfig(document?.fileType || '');

  console.log('DocumentView', document, config);

  if (!document || !config) {
    console.warn('DocumentView: document or config not found');

    return null;
  }

  return (
    <div
      className={mapPropsToClasses({ className }, 'document-view')}
      {...other}
    >
      <config.component document={document} />
    </div>
  );
};
