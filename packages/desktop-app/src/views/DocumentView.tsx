import { DocumentRenderer } from '@minddrop/documents';

export const DocumentView: React.FC<{ id: string }> = ({ id }) => {
  return <DocumentRenderer id={id} />;
};
