import { DocumentRenderer } from '@minddrop/ui-desktop';

export const DocumentView: React.FC<{ id: string }> = ({ id }) => {
  return <DocumentRenderer id={id} />;
};
