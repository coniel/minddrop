import { useCallback, useMemo } from 'react';
import { Document, Documents, useChildDocuments } from '@minddrop/documents';
import { ContentPicker } from '@minddrop/ui-desktop';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
  DocumentNavItem as DocumentNavItemPrimitive,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverPortal,
  Tooltip,
} from '@minddrop/ui-elements';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import { useCurrentDocumentId } from '../../AppUiState';
import {
  createSubdocument,
  moveDocument,
  revealInFileExplorer,
  setActiveDocument,
} from '../../api';
import { createDocumentOptionsMenu } from '../../menus/createDocumentOptionsMenu';
import { DocumentNavItemIcon } from '../DocumentNavItemIcon';
import { RenameDocumentPopover } from '../RenameDocumentPopover';

export interface DocumentNavItemProps {
  /**
   * The document.
   */
  document: Document;

  /**
   * The nav item level, if nested inside another
   * DocumentNavItem.
   */
  level?: number;
}

export const DocumentNavItem: React.FC<DocumentNavItemProps> = ({
  document,
  level = 0,
  ...other
}) => {
  const currentDocumentId = useCurrentDocumentId();
  // Get the document's child documents
  const childDocuments = useChildDocuments(document.path);
  // Used to add active styles when the context/dropdown menu is open
  const [hasActiveMenu, toggleHasActiveMenu] = useToggle(false);
  // Used to show the icon selection popover
  const [showIconSelection, toggleShowIconSelection, setShowIconSelection] =
    useToggle(false);
  // Used to show the rename document popover
  const [renamePopoverOpen, toggleRenamePopoverOpen] = useToggle(false);
  // Used to show the move selection popover
  const [movePopoverOpen, toggleMovePopoverOpen] = useToggle(false);
  // Callback fired when the user selects the "Reveal in File Explorer" option
  const hadnleReavealInFileExplorer = useCreateCallback(
    revealInFileExplorer,
    document.path,
  );
  // Callback fired when the user selects the "Delete" option
  const handleSelectDelete = useCreateCallback(Documents.delete, document.id);
  // Callback fired when the user clicks the "Add Subdocument" button
  const handleClickAddSubdocument = useCreateCallback(
    createSubdocument,
    document.id,
  );
  // Callback fired when the user clicks the nav item
  const handleClick = useCreateCallback(setActiveDocument, document.id);

  const handleSelectMove = useCallback(
    (path: string) => moveDocument(document.id, path),
    [document.id],
  );

  // Configure the options menu content
  const optionsMenuContent = useMemo(
    () =>
      createDocumentOptionsMenu({
        onSelectChangeIcon: toggleShowIconSelection,
        onSelectRevealInFileExplorer: hadnleReavealInFileExplorer,
        onSelectRename: toggleRenamePopoverOpen,
        onSelectDelete: handleSelectDelete,
        onSelectMove: toggleMovePopoverOpen,
      }),
    [
      hadnleReavealInFileExplorer,
      toggleShowIconSelection,
      toggleRenamePopoverOpen,
      handleSelectDelete,
      toggleMovePopoverOpen,
    ],
  );

  return (
    <Popover open={renamePopoverOpen || movePopoverOpen}>
      <PopoverAnchor>
        <ContextMenu onOpenChange={toggleHasActiveMenu}>
          <ContextMenuTrigger>
            <DocumentNavItemPrimitive
              level={level}
              active={currentDocumentId === document.id}
              hovering={hasActiveMenu}
              hasSubdocuments={childDocuments.length > 0}
              label={document.title}
              icon={
                <DocumentNavItemIcon
                  document={document}
                  showIconSelection={showIconSelection}
                  onShowIconSelectionChange={setShowIconSelection}
                />
              }
              onClick={handleClick}
              actions={
                <div style={{ columnGap: 2, display: 'flex' }}>
                  <DropdownMenu onOpenChange={toggleHasActiveMenu}>
                    <DropdownMenuTrigger>
                      <IconButton
                        label="documents.actions.options"
                        size="small"
                        icon="more-vertical"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent
                        align="start"
                        minWidth={220}
                        content={optionsMenuContent}
                      />
                    </DropdownMenuPortal>
                  </DropdownMenu>
                  <Tooltip title="documents.actions.addSubdocument">
                    <IconButton
                      label="documents.actions.addSubdocument"
                      size="small"
                      icon="plus"
                      onClick={handleClickAddSubdocument}
                    />
                  </Tooltip>
                </div>
              }
              {...other}
            >
              {childDocuments.map((childDocument) => (
                <DocumentNavItem
                  key={childDocument.id}
                  level={level + 1}
                  document={childDocument}
                />
              ))}
            </DocumentNavItemPrimitive>
          </ContextMenuTrigger>
          <ContextMenuPortal>
            <ContextMenuContent minWidth={220} content={optionsMenuContent} />
          </ContextMenuPortal>
        </ContextMenu>
      </PopoverAnchor>
      <PopoverPortal>
        <>
          {renamePopoverOpen && (
            <RenameDocumentPopover
              document={document}
              onClose={toggleRenamePopoverOpen}
            />
          )}
          {movePopoverOpen && (
            <ContentPicker
              onClose={toggleMovePopoverOpen}
              onSelect={handleSelectMove}
              omit={document.path}
            />
          )}
        </>
      </PopoverPortal>
    </Popover>
  );
};
