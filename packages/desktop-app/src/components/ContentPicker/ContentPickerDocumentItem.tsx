import {
  DefaultDocumentIcon,
  useChildDocuments,
  useDocument,
} from '@minddrop/documents';
import { ContentListItem, ContentListItemProps } from '@minddrop/ui';
import { useCreateCallback } from '@minddrop/utils';
import { NavItemIcon } from '../NavItemIcon';

export interface ContentPickerDocumentItemProps
  extends Pick<ContentListItemProps, 'level'> {
  /**
   * The document path.
   */
  path: string;

  /**
   * Callback fired when the document is selected.
   */
  onClick(path: string): void;

  /**
   * Path of a subdocument to omit from child documents.
   */
  omitSubdocument?: string;
}

export const ContentPickerDocumentItem: React.FC<
  ContentPickerDocumentItemProps
> = ({ path, omitSubdocument, onClick, level = 0 }) => {
  const document = useDocument(path);
  // Get the document's child documents, except for possible
  // omitted one.
  const subdocuments = useChildDocuments(path).filter(
    (subdocument) => subdocument.path !== omitSubdocument,
  );

  const handleClick = useCreateCallback(onClick, path);

  if (!document) {
    return null;
  }

  return (
    <ContentListItem
      hasChildren={!!subdocuments.length}
      level={level}
      label={document.title}
      onClick={handleClick}
      icon={
        <NavItemIcon
          icon={document.properties.icon}
          defaultIcon={DefaultDocumentIcon}
          color="light"
        />
      }
    >
      {subdocuments.map((subdocument) => (
        <ContentPickerDocumentItem
          key={subdocument.path}
          level={level + 1}
          path={subdocument.path}
          omitSubdocument={omitSubdocument}
          onClick={onClick}
        />
      ))}
    </ContentListItem>
  );
};
