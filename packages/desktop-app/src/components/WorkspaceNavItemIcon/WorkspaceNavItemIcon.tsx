import { useCreateCallback, useToggle } from '@minddrop/utils';
import { Workspace } from '@minddrop/workspaces';
import { useCallback, useEffect, useMemo } from 'react';
import { ContentIconName, EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { ContentColor } from '@minddrop/core';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@minddrop/ui';
import {
  clearWorkspaceIcon,
  setWorkspaceContentIcon,
  setWorkspaceContentIconColor,
  setWorkspaceEmoji,
} from '../../api';
import { NavItemIcon } from '../NavItemIcon';
import { IconPicker } from '../IconPicker';

export interface WorkspaceNavItemIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the NavItemIcon.
   */
  children?: React.ReactNode;
}

export const WorkspaceNavItemIcon: React.FC<{
  workspace: Workspace;
  showIconSelection: boolean;
  onShowIconSelectionChange(value: boolean): void;
}> = ({ showIconSelection = false, onShowIconSelectionChange, workspace }) => {
  // Use current content-icon color (if set) as the default icon color
  const defaultIconColor = useMemo(
    () =>
      workspace.icon.type === UserIconType.ContentIcon
        ? workspace.icon.color
        : undefined,
    [workspace.icon],
  );
  // Use current emoji skin tone (if set) as the default icon color
  const defaultEmojiSkinTone = useMemo(
    () =>
      workspace.icon.type === UserIconType.Emoji
        ? workspace.icon.skinTone
        : undefined,
    [workspace.icon],
  );

  const [pickerPopoverOpen, _, setPickerPopoverOpen] =
    useToggle(showIconSelection);

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [showIconSelection]);

  const handleClear = useCreateCallback(clearWorkspaceIcon, workspace.path);

  const handleShowIconSelectionChange = useCallback(
    (value: boolean) => {
      onShowIconSelectionChange(value);
      setPickerPopoverOpen(value);
    },
    [onShowIconSelectionChange],
  );

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      setWorkspaceContentIcon(workspace.path, icon, color),
    [workspace.path],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) => setWorkspaceContentIconColor(workspace, color),
    [workspace],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      setWorkspaceEmoji(workspace.path, emoji, skinTone),
    [workspace.path],
  );

  return (
    <Popover
      open={pickerPopoverOpen}
      onOpenChange={handleShowIconSelectionChange}
    >
      <PopoverTrigger asChild>
        <NavItemIcon icon={workspace.icon} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          style={{ borderRadius: 8 }}
          side="top"
          sideOffset={4}
          collisionPadding={{ left: 14 }}
        >
          <IconPicker
            defaultPicker={workspace.icon.type}
            defaultIconColor={defaultIconColor}
            defaultEmojiSkinTone={defaultEmojiSkinTone}
            onClear={handleClear}
            onSelectIcon={handleSelectContentIcon}
            onSelectIconColor={handleSelectIconColor}
            onSelectEmoji={handleSelectEmoji}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
