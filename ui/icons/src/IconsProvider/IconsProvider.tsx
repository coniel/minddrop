import { DynamicIcon } from 'lucide-react/dynamic';
import { createContext } from '@minddrop/utils';
import { EmojiSkinTone } from '../types';

export interface IconsProviderProps {
  children: React.ReactNode;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

export interface IconsProviderContext {
  UiIcon: typeof DynamicIcon;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

const [hook, Provider, Consumer] = createContext<IconsProviderContext>();

export const IconsProvider: React.FC<IconsProviderProps> = ({
  children,
  defaultEmojiSkinTone,
  onDefaultEmojiSkinToneChange,
}) => (
  <Provider
    value={{
      UiIcon: DynamicIcon,
      defaultEmojiSkinTone,
      onDefaultEmojiSkinToneChange,
    }}
  >
    {children}
  </Provider>
);

export const useIcons = hook;
export const IconsConsumer = Consumer;
