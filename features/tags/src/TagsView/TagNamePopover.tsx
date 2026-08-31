import { useEffect, useRef, useState } from 'react';
import { DefaultTagIcon, Tag, Tags } from '@minddrop/tags';
import { Icons } from '@minddrop/ui-icons';
import {
  ContentIcon,
  Group,
  IconButton,
  IconPicker,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  Stack,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';

export interface TagNamePopoverProps {
  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The element the popover is anchored to.
   */
  anchor?: PopoverPositionerProps['anchor'];

  /**
   * The tag being renamed.
   */
  tag: Tag;

  /**
   * Takes a hold keeping the anchor visible while the popover is
   * open, returning a release function.
   */
  holdAnchor?: () => VoidFunction;
}

/**
 * Renders an anchored popover containing a tag's icon and name
 * fields. Icon picks apply immediately; the name commits on Enter
 * or blur, cancels on Escape or when blank, and duplicates show
 * an error.
 */
export const TagNamePopover: React.FC<TagNamePopoverProps> = ({
  open,
  onOpenChange,
  anchor,
  tag,
  holdAnchor,
}) => {
  const cancelledRef = useRef(false);
  const [name, setName] = useState(tag.name);
  const [nameTaken, setNameTaken] = useState(false);

  // Reset the field to the tag's current name when opened
  useEffect(() => {
    if (open) {
      setName(tag.name);
      setNameTaken(false);
      cancelledRef.current = false;
    }
  }, [open, tag.name]);

  // Keep the anchor visible while open
  useEffect(() => {
    if (open) {
      return holdAnchor?.();
    }
  }, [open, holdAnchor]);

  // Persist the picked icon
  function handleSelectIcon(icon: string) {
    Tags.update(tag.id, { icon });
  }

  // Restore the default icon in the tag's color
  function handleClearIcon() {
    Tags.update(tag.id, { icon: Icons.applyColor(DefaultTagIcon, tag.color) });
  }

  // Clear the duplicate error while editing
  function handleNameChange(value: string) {
    setName(value);
    setNameTaken(false);
  }

  // Persist the rename, returning whether the field was resolved:
  // blank names cancel, duplicates show an error
  async function commitName(): Promise<boolean> {
    const trimmedName = name.trim();

    // A blank name cancels the rename
    if (!trimmedName) {
      setName(tag.name);

      return true;
    }

    // The name is unchanged
    if (trimmedName === tag.name) {
      return true;
    }

    // Another tag already has the name
    const existing = Tags.getByName(trimmedName, false);

    if (existing && existing.id !== tag.id) {
      setNameTaken(true);

      return false;
    }

    try {
      await Tags.update(tag.id, { name: trimmedName });

      return true;
    } catch {
      setNameTaken(true);

      return false;
    }
  }

  // Commit the name when focus leaves the field, unless cancelled
  function handleBlur() {
    if (!cancelledRef.current) {
      commitName();
    }
  }

  // Commit on Enter, closing when resolved; cancel on Escape
  async function handleNameKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter') {
      const resolved = await commitName();

      if (resolved) {
        onOpenChange(false);
      }
    }

    if (event.key === 'Escape') {
      cancelledRef.current = true;
      onOpenChange(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="start" anchor={anchor}>
          <PopoverContent className="tag-rename-popover">
            <Stack gap={1}>
              <Group gap={1}>
                <IconPicker
                  closeOnSelect
                  currentIcon={tag.icon}
                  onSelect={handleSelectIcon}
                  onClear={handleClearIcon}
                >
                  <IconButton
                    size="md"
                    variant="ghost"
                    color="neutral"
                    label="tags.details.icon"
                  >
                    <ContentIcon icon={tag.icon} />
                  </IconButton>
                </IconPicker>
                <TextInput
                  autoFocus
                  unassisted
                  size="md"
                  variant="ghost"
                  className="tag-form-popover-name"
                  placeholder="tags.details.namePlaceholder"
                  value={name}
                  onValueChange={handleNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleNameKeyDown}
                />
              </Group>

              {/* Duplicate name error */}
              {nameTaken && (
                <Text
                  block
                  size="sm"
                  color="danger"
                  text="tags.form.nameTaken"
                />
              )}
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
