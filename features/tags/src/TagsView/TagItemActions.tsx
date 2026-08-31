import { useRef, useState } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import { Tag, TagGroup, TagGroups, TagGroupsIcon, Tags } from '@minddrop/tags';
import {
  DropdownMenuColorSelectionItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  Icon,
  IconButton,
  MenuItemDropdownMenu,
  useMenuItemContext,
} from '@minddrop/ui-primitives';
import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { TagNamePopover } from './TagNamePopover';

export interface TagItemActionsProps {
  /**
   * The tag the actions apply to.
   */
  tag: Tag;
}

/**
 * Renders a tag list item's actions menu: renaming (via a naming
 * popover), color and group selection submenus, and deletion.
 */
export const TagItemActions: React.FC<TagItemActionsProps> = ({ tag }) => {
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const releaseActionsHoldRef = useRef<VoidFunction | null>(null);
  const [renaming, setRenaming] = useState(false);
  const { t } = useTranslation();
  const { holdActionsVisible } = useMenuItemContext();
  const groups = TagGroups.useAll();

  // Hold the anchor button visible while the rename popover is
  // open so the popover does not reposition
  function handleRenamingChange(open: boolean) {
    setRenaming(open);

    if (open) {
      releaseActionsHoldRef.current = holdActionsVisible();
    } else {
      releaseActionsHoldRef.current?.();
      releaseActionsHoldRef.current = null;
    }
  }

  // Persist the selected color
  function handleSetColor(color: ContentColor) {
    Tags.update(tag.id, { color });
  }

  // Persist the selected group, clearing it on the none option
  function handleSetGroup(group: TagGroup | null) {
    Tags.update(tag.id, { group: group ? group.id : null });
  }

  // Confirm before deleting the tag, noting how many entries
  // reference it
  function handleDelete() {
    const count = DatabaseEntries.getTagged(tag.name).length;

    // Pick the plural form matching the count
    const messageKey =
      count === 1
        ? 'tags.actions.delete.confirmation.message_one'
        : 'tags.actions.delete.confirmation.message_other';

    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'tags.actions.delete.confirmation.title',
      message: <>{t(messageKey, { count })}</>,
      confirmLabel: 'tags.actions.delete.confirmation.confirm',
      onConfirm: () => Tags.delete(tag.id),
    });
  }

  return (
    <>
      <MenuItemDropdownMenu>
        <DropdownMenuTrigger>
          <IconButton
            ref={optionsButtonRef}
            icon="ellipsis"
            size="sm"
            variant="subtle"
            color="neutral"
            label="tags.actions.options"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent>
              <DropdownMenuItem
                icon="pencil"
                label="tags.actions.rename"
                onSelect={() => handleRenamingChange(true)}
              />

              {/* The tag's color */}
              <DropdownSubmenu>
                <DropdownSubmenuTriggerItem
                  icon="palette"
                  label="tags.actions.color"
                />
                <DropdownMenuPortal>
                  <DropdownMenuPositioner
                    side="right"
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownSubmenuContent>
                      {ContentColors.map((color) => (
                        <DropdownMenuColorSelectionItem
                          key={color}
                          color={color}
                          checked={color === tag.color}
                          onClick={() => handleSetColor(color)}
                        />
                      ))}
                    </DropdownSubmenuContent>
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </DropdownSubmenu>

              {/* The tag's group assignment */}
              <DropdownSubmenu>
                <DropdownSubmenuTriggerItem
                  icon={TagGroupsIcon}
                  label="tags.actions.group"
                />
                <DropdownMenuPortal>
                  <DropdownMenuPositioner
                    side="right"
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownSubmenuContent>
                      <DropdownMenuItem
                        label="tags.details.groupNone"
                        trailingIcon={
                          !tag.group ? <Icon name="check" /> : undefined
                        }
                        onSelect={() => handleSetGroup(null)}
                      />
                      {groups.map((group) => (
                        <DropdownMenuItem
                          key={group.id}
                          stringLabel={group.name}
                          trailingIcon={
                            tag.group === group.id ? (
                              <Icon name="check" />
                            ) : undefined
                          }
                          onSelect={() => handleSetGroup(group)}
                        />
                      ))}
                    </DropdownSubmenuContent>
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </DropdownSubmenu>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                danger
                icon="trash-2"
                label="tags.actions.delete.label"
                onSelect={handleDelete}
              />
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </MenuItemDropdownMenu>

      {/* Renames the tag in place of the menu */}
      <TagNamePopover
        open={renaming}
        onOpenChange={handleRenamingChange}
        anchor={optionsButtonRef}
        tag={tag}
      />
    </>
  );
};
