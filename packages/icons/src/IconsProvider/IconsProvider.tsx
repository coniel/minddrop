import { createContext } from '@minddrop/utils';
import { EvaIconSvg, EvaIconSvgProps } from '../EvaIconSvg';
import { LucidIconSvgProps, LucideIconSvg } from '../LucideIconSvg';
import { ContentIcons as ContentIconsChildren } from '../content-icons.min';
import { EmojiSkinTone } from '../emoji';
import { ContentIconSet, UiIconSet } from '../icons.types';
import { UiIcons as UiIconsChildren } from '../ui-icons.min';

export interface IconsProviderProps {
  children: React.ReactNode;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

export interface IconsProviderContext {
  UiIcons: UiIconSet;
  ContentIcons: ContentIconSet;
  defaultEmojiSkinTone: EmojiSkinTone;
  onDefaultEmojiSkinToneChange: (skinTone: EmojiSkinTone) => void;
}

const UiIcons = Object.entries(UiIconsChildren).reduce(
  (map, [name, content]) => ({
    ...map,
    [name]: (props: EvaIconSvgProps) => (
      <EvaIconSvg {...props}>{content}</EvaIconSvg>
    ),
  }),
  {} as UiIconSet,
);

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
      UiIcons,
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
