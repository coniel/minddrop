import { useState } from 'react';
import {
  ContentIconName,
  EmojiSkinTone,
  UserIconType,
  useIcons,
} from '@minddrop/icons';
import { Button } from '../Button';
import { ContentIconPicker } from '../ContentIconPicker';
import { EmojiPicker } from '../EmojiPicker';
import { ContentColor } from '../types';
import './IconPicker.css';

export interface IconPickerProps {
  /**
   * The default icon picker type. Typically set to
   * the current icon type if available.
   */
  defaultPicker?: UserIconType;

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
  onSelectIcon(icon: ContentIconName, color: ContentColor): void;

  /**
   * Callback fired when an icon color is selected.
   */
  onSelectIconColor(color: ContentColor): void;

  /**
   * Callback fired when an emoji is selected.
   */
  onSelectEmoji(emoji: string, skinTone: EmojiSkinTone): void;

  /**
   * Callback fired when the clear button is clicked.
   */
  onClear(): void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  defaultPicker,
  defaultIconColor,
  defaultEmojiSkinTone: defaultEmojiSkinToneProp,
  onSelectIcon,
  onSelectIconColor,
  onSelectEmoji,
  onClear,
}) => {
  const [tab, setTab] = useState<UserIconType>(
    defaultPicker || UserIconType.ContentIcon,
  );
  const { defaultEmojiSkinTone, onDefaultEmojiSkinToneChange } = useIcons();
  const initialEmojiSkinTone = defaultEmojiSkinToneProp || defaultEmojiSkinTone;

  return (
    <div className="icon-picker">
      <div className="header">
        <Button
          label="Icons"
          onClick={() => setTab(UserIconType.ContentIcon)}
          variant={tab !== UserIconType.Emoji ? 'contained' : 'text'}
        />
        <Button
          label="Emoji"
          onClick={() => setTab(UserIconType.Emoji)}
          variant={tab === UserIconType.Emoji ? 'contained' : 'text'}
        />
        <div style={{ flex: 1 }} />
        <Button variant="text" label="actions.clear" onClick={onClear} />
      </div>
      {tab !== UserIconType.Emoji && (
        <ContentIconPicker
          defaultColor={defaultIconColor}
          onSelect={onSelectIcon}
          onSelectColor={onSelectIconColor}
        />
      )}
      {tab === UserIconType.Emoji && (
        <EmojiPicker
          onSelect={onSelectEmoji}
          onSelectSkinTone={onDefaultEmojiSkinToneChange}
          defaultSkinTone={initialEmojiSkinTone}
        />
      )}
    </div>
  );
};
