import { DynamicIcon } from 'lucide-react/dynamic';
import { createContext } from '@minddrop/utils';
import { LucidIconSvgProps, LucideIconSvg } from '../LucideIconSvg';
import { ContentIcons as ContentIconsChildren } from '../content-icons.min';
import { EmojiSkinTone } from '../emoji';
import { ContentIconSet } from '../icons.types';

export interface IconsProviderProps {
  children: React.ReactNode;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

export interface IconsProviderContext {
  UiIcon: typeof DynamicIcon;
  ContentIcons: ContentIconSet;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

const ContentIcons = Object.entries(ContentIconsChildren).reduce(
  (map, [name, content]) => ({
    ...map,
    [name]: (props: LucidIconSvgProps) => (
      <LucideIconSvg {...props}>{content}</LucideIconSvg>
    ),
  }),
  {} as ContentIconSet,
);

const [hook, Provider, Consumer] = createContext<IconsProviderContext>();

export const IconsProvider: React.FC<IconsProviderProps> = ({
  children,
  defaultEmojiSkinTone,
  onDefaultEmojiSkinToneChange,
}) => (
  <Provider
    value={{
      UiIcon: DynamicIcon,
      ContentIcons,
      defaultEmojiSkinTone,
      onDefaultEmojiSkinToneChange,
    }}
  >
    {children}
  </Provider>
);

export const useIcons = hook;
export const IconsConsumer = Consumer;
