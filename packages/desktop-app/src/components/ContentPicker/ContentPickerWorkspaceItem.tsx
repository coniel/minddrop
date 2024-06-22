import { useChildDocuments } from '@minddrop/documents';
import { ContentListItem, ContentListItemProps } from '@minddrop/ui';
import { useCreateCallback } from '@minddrop/utils';
import { useWorkspace } from '@minddrop/workspaces';
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
  omitDocument?: string;
}

export const ContentPickerWorkspaceItem: React.FC<
  ContentPickerWorkspaceItemProps
> = ({ path, onClick, omitDocument }) => {
  const workspace = useWorkspace(path);
  const documents = useChildDocuments(path).filter((document) => document.path !== omitDocument);

  const handleClick = useCreateCallback(onClick, path);

  if (!workspace) {
    return null;
  }

  return (
    <ContentListItem
      hasChildren={!!documents.length}
      label={workspace.name}
      onClick={handleClick}
      icon={<NavItemIcon icon={workspace.icon} defaultIcon="folder" />}
    >
      {documents.map((document) => (
        <ContentPickerDocumentItem
          key={document.path}
          level={1}
          path={document.path}
          omitSubdocument={omitDocument}
          onClick={onClick}
        />
      ))}
    </ContentListItem>
  );
};
