import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
  PageNavItem as PageNavItemPrimitive,
  Popover,
  PopoverAnchor,
  PopoverPortal,
  Tooltip,
} from '@minddrop/ui';
import { Page, Pages, useChildPages } from '@minddrop/pages';
import { PageNavItemIcon } from '../PageNavItemIcon';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import { useCallback, useMemo } from 'react';
import {
  createSubpage,
  revealInFileExplorer,
  movePage,
  setActivePage,
} from '../../api';
import { createPageOptionsMenu } from '../../menus/createPageOptionsMenu';
import { RenamePagePopover } from '../RenamePagePopover';
import { ContentPicker } from '../ContentPicker';
import { useCurrentPath } from '../../AppUiState';

export interface PageNavItemProps {
  /**
   * The page.
   */
  page: Page;

  /**
   * The nav item level, if nested inside another
   * PageNavItem.
   */
  level?: number;
}

export const PageNavItem: React.FC<PageNavItemProps> = ({
  page,
  level = 0,
  ...other
}) => {
  // Get the current active path
  const currentPath = useCurrentPath();
  // Get the page's child pages
  const childPages = useChildPages(page.path);
  // Used to add active styles when the context/dropdown menu is open
  const [hasActiveMenu, toggleHasActiveMenu] = useToggle(false);
  // Used to show the icon selection popover
  const [showIconSelection, toggleShowIconSelection, setShowIconSelection] =
    useToggle(false);
  // Used to show the rename page popover
  const [renamePopoverOpen, toggleRenamePopoverOpen] = useToggle(false);
  // Used to show the move selection popover
  const [movePopoverOpen, toggleMovePopoverOpen] = useToggle(false);
  // Callback fired when the user selects the "Reveal in File Explorer" option
  const hadnleReavealInFileExplorer = useCreateCallback(
    revealInFileExplorer,
    page.path,
  );
  // Callback fired when the user selects the "Delete" option
  const handleSelectDelete = useCreateCallback(Pages.delete, page.path);
  // Callback fired when the user clicks the "Add Subpage" button
  const handleClickAddSubpage = useCreateCallback(createSubpage, page.path);
  // Callback fired when the user clicks the nav item
  const handleClick = useCreateCallback(setActivePage, page.path);

  const handleSelectMove = useCallback(
    (path: string) => movePage(page.path, path),
    [page.path],
  );

  // Configure the options menu content
  const optionsMenuContent = useMemo(
    () =>
      createPageOptionsMenu({
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
            <PageNavItemPrimitive
              level={level}
              active={currentPath === page.path}
              hovering={hasActiveMenu}
              hasSubpages={childPages.length > 0}
              label={page.title}
              icon={
                <PageNavItemIcon
                  page={page}
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
                        label="pages.actions.options"
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
                  <Tooltip title="pages.actions.addSubpage">
                    <IconButton
                      label="pages.actions.addSubpage"
                      size="small"
                      icon="plus"
                      onClick={handleClickAddSubpage}
                    />
                  </Tooltip>
                </div>
              }
              {...other}
            >
              {childPages.map((childPage) => (
                <PageNavItem
                  key={childPage.path}
                  level={level + 1}
                  page={childPage}
                />
              ))}
            </PageNavItemPrimitive>
          </ContextMenuTrigger>
          <ContextMenuPortal>
            <ContextMenuContent minWidth={220} content={optionsMenuContent} />
          </ContextMenuPortal>
        </ContextMenu>
      </PopoverAnchor>
      <PopoverPortal>
        <>
          {renamePopoverOpen && (
            <RenamePagePopover page={page} onClose={toggleRenamePopoverOpen} />
          )}
          {movePopoverOpen && (
            <ContentPicker
              onClose={toggleMovePopoverOpen}
              onSelect={handleSelectMove}
              omit={page.path}
            />
          )}
        </>
      </PopoverPortal>
    </Popover>
  );
};
