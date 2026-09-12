import { useEffect, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/ui-theme';
import { ContentColorSwatch } from '../ContentColorSwatch';
import { ContentIcon } from '../ContentIcon';
import { DropdownMenu, DropdownMenuColorSelectionItem } from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { IconPicker } from '../IconPicker';
import { Group, Stack } from '../Layout';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverRootChangeEventDetails,
} from '../Popover';
import { Text } from '../Text';
import { ContentColorValues } from '../constants';
import { TextInput } from '../fields/TextInput';
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
 * Renders an anchored popover naming something: a name field
 * committed with Enter or the check button beside it, and
 * optionally an icon or a colour picked alongside it.
 *
 * A picked icon or colour is a decision of its own and applies as
 * it is picked. A name is not one until it is finished, so it waits
 * to be committed, and a blank one commits nothing.
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
  iconLabel = 'actions.pickIcon',
  colorLabel = 'actions.pickColor',
  submitLabel = 'actions.save',
  className,
}) => {
  const [name, setName] = useState(defaultValue);

  // Reset the field for the next naming when opened
  useEffect(() => {
    if (open) {
      setName(defaultValue);
    }
  }, [open, defaultValue]);

  // Say the naming is done, which the key and the check button
  // both do. Blank names commit nothing, leaving whatever the
  // thing is called and the popover open to try again.
  function handleCommit() {
    if (!name.trim()) {
      return;
    }

    commitName();
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
            <Stack gap={1}>
              <Group gap={1}>
                {onIconChange && (
                  <IconPicker
                    closeOnSelect
                    currentIcon={icon}
                    onSelect={onIconChange}
                    onClear={() => onIconChange(null)}
                  >
                    <IconButton
                      size="md"
                      variant="ghost"
                      color="neutral"
                      label={iconLabel}
                    >
                      <ContentIcon icon={icon} />
                    </IconButton>
                  </IconPicker>
                )}

                {onColorChange && (
                  <DropdownMenu
                    trigger={
                      <IconButton
                        size="md"
                        variant="ghost"
                        color="neutral"
                        label={colorLabel}
                      >
                        <ContentColorSwatch
                          color={color ?? 'default'}
                          unset={(color ?? 'default') === 'default'}
                        />
                      </IconButton>
                    }
                  >
                    {ContentColorValues.map((option) => (
                      <DropdownMenuColorSelectionItem
                        key={option.value}
                        color={option.value}
                        checked={option.value === (color ?? 'default')}
                        onClick={() => onColorChange(option.value)}
                      />
                    ))}
                  </DropdownMenu>
                )}

                <TextInput
                  autoFocus
                  unassisted
                  size="md"
                  variant="ghost"
                  className="name-popover-field"
                  placeholder={placeholder}
                  value={name}
                  onValueChange={setName}
                  onCommit={handleCommit}
                />

                <IconButton
                  icon="check"
                  size="md"
                  variant="ghost"
                  color="neutral"
                  label={submitLabel}
                  onClick={handleCommit}
                />
              </Group>

              {/* What makes the name unacceptable is the consumer's
                  to say */}
              {error && (
                <Text
                  block
                  size="sm"
                  color="danger"
                  className="name-popover-error"
                  text={error}
                />
              )}
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
