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
   * Return an error message for an invalid name. The naming stays
   * open and shows it below the field.
   */
  onSubmit: (
    name: string,
  ) => TranslationKey | void | Promise<TranslationKey | void>;

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
  iconLabel,
  colorLabel,
  submitLabel,
  className,
}) => {
  const [name, setName] = useState(defaultValue);
  const [error, setError] = useState<TranslationKey | null>(null);

  // Reset the field for the next naming when opened
  useEffect(() => {
    if (open) {
      setName(defaultValue);
      setError(null);
    }
  }, [open, defaultValue]);

  // Commit the name and close, unless the consumer rejects it
  async function handleSubmit(submittedName: string) {
    const submitError = await onSubmit(submittedName);

    // Show the error and leave the naming open
    if (submitError) {
      setError(submitError);

      return;
    }

    onOpenChange(false);
  }

  // Clear the error while the next name is typed
  function handleValueChange(value: string) {
    setName(value);
    setError(null);
  }

  // Closing the popover settles the name for a consumer which asked
  // for that, whether it was dismissed with a press outside it or by
  // the focus leaving it. Escape is the one close which does not. It
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
              onValueChange={handleValueChange}
              placeholder={placeholder}
              onSubmit={handleSubmit}
              icon={icon}
              onIconChange={onIconChange}
              color={color}
              onColorChange={onColorChange}
              error={error ?? undefined}
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
