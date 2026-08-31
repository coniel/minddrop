import { ReactElement, useState } from 'react';
import {
  ContentIconName,
  EmojiSkinTone,
  Icons,
  UserIconType,
  useIcons,
} from '@minddrop/ui-icons';
import { ContentColor } from '@minddrop/ui-theme';
import { Button } from '../Button';
import { ContentIconPicker } from '../ContentIconPicker';
import { EmojiPicker } from '../EmojiPicker';
import { Spacer } from '../Layout';
import './IconPicker.css';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverTrigger,
} from '../Popover';

export interface IconPickerProps {
  /**
   * The default icon picker type. Typically set to
   * the current icon type if available.
   */
  defaultPicker?: UserIconType;

  /**
   * The popover trigger element. Optional when using
   * controlled open state.
   */
  children?: ReactElement;

  /**
   * The current icon string. Used to set the default
   * color or emoji skin tone.
   */
  currentIcon?: string;

  /**
   * Controlled open state. When provided, the picker
   * operates in controlled mode.
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?(open: boolean): void;

  /**
   * Whether to close the picker upon selection.
   */
  closeOnSelect?: boolean;

  /**
   * The default icon color. Typically set to the current
   * icon color if available.
   */
  defaultIconColor?: ContentColor;

  /**
   * The default emoji skin tone. Typically set to the current
   * emoji skin tone if available.
   */
  defaultEmojiSkinTone?: EmojiSkinTone;

  /**
   * Callback fired when an icon is selected.
   */
  onSelectIcon?(icon: ContentIconName, color: ContentColor, set: string): void;

  /**
   * Callback fired when an icon color is selected.
   */
  onSelectIconColor?(color: ContentColor): void;

  /**
   * Callback fired when an emoji is selected.
   */
  onSelectEmoji?(emoji: string, skinTone: EmojiSkinTone): void;

  /**
   * Callback fired when an icon or emoji is selected.
   * @param iconString String representation of the selected icon or emoji.
   */
  onSelect?(iconString: string): void;

  /**
   * Callback fired when the clear button is clicked.
   */
  onClear?(): void;

  /**
   * The anchor element for popover positioning. Required
   * when no children trigger is provided.
   */
  anchor?: PopoverPositionerProps['anchor'];

  /**
   * The popover alignment.
   * @default 'start'
   */
  align?: PopoverPositionerProps['align'];

  /**
   * The popover side.
   * @default 'bottom'
   */
  side?: PopoverPositionerProps['side'];
}

export const IconPicker: React.FC<IconPickerProps> = ({
  children,
  closeOnSelect,
  defaultEmojiSkinTone: defaultEmojiSkinToneProp,
  defaultIconColor,
  defaultPicker,
  onClear,
  onSelect,
  onSelectEmoji,
  onSelectIcon,
  onSelectIconColor,
  currentIcon,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  anchor,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Support both controlled and uncontrolled open state
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;
  const [tab, setTab] = useState<UserIconType>(
    defaultPicker || UserIconType.ContentIcon,
  );
  const [icon, setIcon] = useState<{
    name: ContentIconName;
    set: string;
  } | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const { defaultEmojiSkinTone, onDefaultEmojiSkinToneChange } = useIcons();
  const initialEmojiSkinTone = defaultEmojiSkinToneProp || defaultEmojiSkinTone;

  const handleSelectIcon = (
    icon: ContentIconName,
    color: ContentColor,
    set: string,
    preventClose = false,
  ) => {
    setIcon({ name: icon, set });

    if (onSelectIcon) {
      onSelectIcon(icon, color, set);
    }

    if (onSelect) {
      // Stringifying qualifies the icon with its set when it is not
      // from the built-in set
      onSelect(
        Icons.stringify({ type: UserIconType.ContentIcon, set, icon, color }),
      );
    }

    if (closeOnSelect && !preventClose) {
      setOpen(false);
    }
  };

  const handleSelectEmoji = (
    emoji: string,
    skinTone: EmojiSkinTone,
    preventClose = false,
  ) => {
    setEmoji(emoji);

    if (onSelectEmoji) {
      onSelectEmoji(emoji, skinTone);
    }

    if (onSelect) {
      onSelect(skinTone ? `emoji:${emoji}:${skinTone}` : `emoji:${emoji}`);
    }

    if (closeOnSelect && !preventClose) {
      setOpen(false);
    }
  };

  const handleSelectIconColor = (color: ContentColor) => {
    if (icon) {
      handleSelectIcon(icon.name, color, icon.set, true);
    }

    if (onSelectIconColor) {
      onSelectIconColor(color);
    }
  };

  const handleSelectEmojiSkinTone = (skinTone: EmojiSkinTone) => {
    if (emoji) {
      handleSelectEmoji(emoji, skinTone, true);
    }

    onDefaultEmojiSkinToneChange(skinTone);
  };

  const handleClear = () => {
    setIcon(null);
    setEmoji(null);

    if (onClear) {
      onClear();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {children && <PopoverTrigger>{children}</PopoverTrigger>}
      <PopoverPortal>
        <PopoverPositioner align="start" side="bottom" anchor={anchor}>
          <PopoverContent>
            <div className="icon-picker" onClick={stopPropagation}>
              <div className="icon-picker-header">
                <Button
                  label="iconPicker.label"
                  onClick={() => setTab(UserIconType.ContentIcon)}
                  variant={tab !== UserIconType.Emoji ? 'filled' : 'ghost'}
                />
                <Button
                  label="emojiPicker.label"
                  onClick={() => setTab(UserIconType.Emoji)}
                  variant={tab === UserIconType.Emoji ? 'filled' : 'ghost'}
                />
                <Spacer />
                <Button
                  variant="ghost"
                  label="actions.clear"
                  onClick={handleClear}
                />
              </div>
              {tab !== UserIconType.Emoji && (
                <ContentIconPicker
                  defaultColor={
                    (currentIcon && Icons.resolveColor(currentIcon)) ||
                    defaultIconColor
                  }
                  onSelect={handleSelectIcon}
                  onSelectColor={handleSelectIconColor}
                />
              )}
              {tab === UserIconType.Emoji && (
                <EmojiPicker
                  onSelect={handleSelectEmoji}
                  onSelectSkinTone={handleSelectEmojiSkinTone}
                  defaultSkinTone={
                    (currentIcon && Icons.getSkinTone(currentIcon)) ||
                    initialEmojiSkinTone
                  }
                />
              )}
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

// Prevent clicks inside the picker from bubbling through
// React's portal event system to parent components
function stopPropagation(event: React.MouseEvent) {
  event.stopPropagation();
}
