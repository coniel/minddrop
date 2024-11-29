import { mapPropsToClasses } from '@minddrop/utils';
import { useDocument } from '../../useDocument';
import { DocumentViewsRenderer } from '../DocumentViewsRenderer';

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
    <div
      className={mapPropsToClasses({ className }, 'document-renderer')}
      {...other}
    >
      <DocumentViewsRenderer document={document} />
    </div>
  );
};
