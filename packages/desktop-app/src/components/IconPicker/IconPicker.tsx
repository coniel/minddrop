import { useCallback, useState } from 'react';
import {
  EmojiPicker,
  ContentIconPicker,
  ContentColor,
  Button,
} from '@minddrop/ui';
import { ContentIconName, EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { AppUiState, useDefaultEmojiSkinTone } from '../../AppUiState';
import './IconPicker.css';

interface IconPickerProps {
  defaultPicker?: UserIconType;
  defaultIconColor?: ContentColor;
  defaultEmojiSkinTone?: EmojiSkinTone;
  onSelectIcon(icon: ContentIconName, color: ContentColor): void;
  onSelectIconColor(color: ContentColor): void;
  onSelectEmoji(emoji: string, skinTone: EmojiSkinTone): void;
  onClear(): void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  defaultPicker,
  defaultIconColor,
  defaultEmojiSkinTone,
  onSelectIcon,
  onSelectIconColor,
  onSelectEmoji,
  onClear,
}) => {
  const [tab, setTab] = useState<UserIconType>(
    defaultPicker || UserIconType.ContentIcon,
  );
  const globalDefaultEmojiSkinTone = useDefaultEmojiSkinTone();
  const initialEmojiSkinTone =
    defaultEmojiSkinTone || globalDefaultEmojiSkinTone;

  const handleSelectEmojiSkinTone = useCallback((skinTone: EmojiSkinTone) => {
    AppUiState.set('defaultEmojiSkinTone', skinTone);
  }, []);

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
          onSelectSkinTone={handleSelectEmojiSkinTone}
          defaultSkinTone={initialEmojiSkinTone}
        />
      )}
    </div>
  );
};
