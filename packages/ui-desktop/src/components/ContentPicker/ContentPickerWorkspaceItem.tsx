import { useChildDocuments } from '@minddrop/documents';
import { ContentListItem, ContentListItemProps } from '@minddrop/ui-elements';
import { useCreateCallback } from '@minddrop/utils';
import { DefaultWorkspaceIcon, useWorkspace } from '@minddrop/workspaces';
import { NavItemIcon } from '../NavItemIcon';
import { ContentPickerDocumentItem } from './ContentPickerDocumentItem';

export interface ContentPickerWorkspaceItemProps
  extends Pick<ContentListItemProps, 'level'> {
  /**
   * The workspace path.
   */
  path: string;

  /**
   * Callback fired when the workspace or one of its documents
   * is selected.
   */
  onClick(path: string): void;

  /**
   * Path of a document to omit from child documents.
   */
  omitDocumentId?: string;

  /**
   * Determines which type of content that can be picked.
   */
  pickable?: 'workspace' | 'document' | 'any';
}

export const ContentPickerWorkspaceItem: React.FC<
  ContentPickerWorkspaceItemProps
> = ({ path, onClick, omitDocumentId: omitDocument, pickable = 'any' }) => {
  const workspace = useWorkspace(path);
  const documents = useChildDocuments(path).filter(
    (document) => document.id !== omitDocument,
  );

  const handleClick = useCreateCallback(onClick, path);

  if (!workspace) {
    return null;
  }

  return (
    <ContentListItem
      hasChildren={!!documents.length}
      label={workspace.name}
      onClick={handleClick}
      selectable={pickable === 'workspace' || pickable === 'any'}
      icon={
        <NavItemIcon icon={workspace.icon} defaultIcon={DefaultWorkspaceIcon} />
      }
    >
      {(pickable === 'document' || pickable === 'any') &&
        documents.map((document) => (
          <ContentPickerDocumentItem
            key={document.id}
            level={1}
            id={document.id}
            omitSubdocument={omitDocument}
            onClick={onClick}
          />
        ))}
    </ContentListItem>
  );
};
