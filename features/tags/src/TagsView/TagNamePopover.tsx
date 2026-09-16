import { TranslationKey } from '@minddrop/i18n';
import { Tag, Tags } from '@minddrop/tags';
import { Icons } from '@minddrop/ui-icons';
import { NamePopover, PopoverPositionerProps } from '@minddrop/ui-primitives';

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
}

/**
 * Renders an anchored popover naming a tag and picking its icon.
 * The name is committed when the popover closes, and Escape
 * cancels it.
 */
export const TagNamePopover: React.FC<TagNamePopoverProps> = ({
  open,
  onOpenChange,
  anchor,
  tag,
}) => {
  // Update the tag's icon, restoring the default icon in the tag's
  // color when the picked one is cleared.
  function handleIconChange(icon: string | null) {
    Tags.update(tag.id, {
      icon:
        icon ?? Icons.applyColor(Tags.constants.EntityDefaultIcon, tag.color),
    });
  }

  // Rename the tag, returning the error to show when the rename is
  // rejected.
  async function handleRename(
    name: string,
  ): Promise<TranslationKey | undefined> {
    // Check whether the name changed
    if (name === tag.name) {
      return;
    }

    // Rename the tag, which rejects a name another tag already has
    try {
      await Tags.update(tag.id, { name });
    } catch {
      return 'tags.form.nameTaken';
    }
  }

  return (
    <NamePopover
      commitOnClose
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
      defaultValue={tag.name}
      placeholder="tags.details.namePlaceholder"
      onSubmit={handleRename}
      icon={tag.icon}
      onIconChange={handleIconChange}
      iconLabel="tags.details.icon"
    />
  );
};
