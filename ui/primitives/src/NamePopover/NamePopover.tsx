import { useEffect, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/ui-theme';
import { NameForm } from '../NameForm';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverRootChangeEventDetails,
} from '../Popover';
import './NamePopover.css';

export interface NamePopoverProps {
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
   * The value the field opens with.
   */
  defaultValue?: string;

  /**
   * Placeholder shown while the field is empty.
   */
  placeholder?: TranslationKey;

  /**
   * Callback fired with the trimmed name when it is committed.
   */
  onSubmit: (name: string) => void;

  /**
   * The stringified content icon shown beside the field. Given
   * alongside `onIconChange` for a popover which picks an icon.
   */
  icon?: string;

  /**
   * Callback fired with the picked icon, and with null when the
   * icon is cleared.
   */
  onIconChange?: (icon: string | null) => void;

  /**
   * The colour shown beside the field. Given alongside
   * `onColorChange` for a popover which picks a colour.
   */
  color?: ContentColor;

  /**
   * Callback fired with the picked colour.
   */
  onColorChange?: (color: ContentColor) => void;

  /**
   * Whether closing the popover commits the name in the field, for
   * names which are settled by moving on rather than by saying so.
   * Escape still cancels, leaving the name as it was.
   *
   * @default false
   */
  commitOnClose?: boolean;

  /**
   * Message shown below the field, e.g. when the name is taken.
   */
  error?: TranslationKey;

  /**
   * Accessible label of the button which picks the icon.
   * @default 'actions.pickIcon'
   */
  iconLabel?: TranslationKey;

  /**
   * Accessible label of the button which picks the colour.
   * @default 'actions.pickColor'
   */
  colorLabel?: TranslationKey;

  /**
   * Accessible label of the button which commits the name.
   * @default 'actions.save'
   */
  submitLabel?: TranslationKey;

  /**
   * Class name applied to the popover content.
   */
  className?: string;
}

/**
 * Renders an anchored popover naming something, closing once the
 * name is committed.
 */
export const NamePopover: React.FC<NamePopoverProps> = ({
  open,
  onOpenChange,
  anchor,
  defaultValue = '',
  placeholder,
  onSubmit,
  icon,
  onIconChange,
  color,
  onColorChange,
  commitOnClose = false,
  error,
  iconLabel,
  colorLabel,
  submitLabel,
  className,
}) => {
  const [name, setName] = useState(defaultValue);

  // Reset the field for the next naming when opened
  useEffect(() => {
    if (open) {
      setName(defaultValue);
    }
  }, [open, defaultValue]);

  // Committing the name is the end of the naming
  function handleSubmit(submittedName: string) {
    onSubmit(submittedName);
    onOpenChange(false);
  }

  // Closing the popover settles the name for a consumer which asked
  // for that, whether it was dismissed with a press outside it or by
  // the focus leaving it. Escape is the one close which does not: it
  // cancels, leaving the name as it was.
  function handleOpenChange(
    nextOpen: boolean,
    eventDetails: PopoverRootChangeEventDetails,
  ) {
    if (!nextOpen && commitOnClose && eventDetails.reason !== 'escape-key') {
      commitName();
    }

    onOpenChange(nextOpen);
  }

  // Hand the name over, unless it is blank
  function commitName() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onSubmit(trimmedName);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="start" anchor={anchor}>
          <PopoverContent className={`name-popover ${className ?? ''}`.trim()}>
            <NameForm
              value={name}
              onValueChange={setName}
              placeholder={placeholder}
              onSubmit={handleSubmit}
              icon={icon}
              onIconChange={onIconChange}
              color={color}
              onColorChange={onColorChange}
              error={error}
              iconLabel={iconLabel}
              colorLabel={colorLabel}
              submitLabel={submitLabel}
            />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
