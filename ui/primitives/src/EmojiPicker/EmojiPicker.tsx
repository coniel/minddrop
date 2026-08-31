import { useVirtualizer } from '@tanstack/react-virtual';
import {
  FC,
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Emoji,
  EmojiItem,
  EmojiSkinTone,
  useEmojiData,
} from '@minddrop/ui-icons';
import { IconButton } from '../IconButton';
import { MenuLabel } from '../Menu';
import { ScrollArea } from '../ScrollArea';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { TextField } from '../fields/TextField';
import { propsToClass } from '../utils';
import './EmojiPicker.css';

export interface EmojiPickerProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onSelect'> {
  /**
   * Calback fired when an emoji is selected.
   */
  onSelect?(emoji: string, skinTone: EmojiSkinTone): void;

  /**
   * Callback fired when a skin tone is selected.
   */
  onSelectSkinTone?(value: EmojiSkinTone): void;

  /**
   * Recently used emoji shown as the first category.
   */
  recent?: string[];

  /**
   * Thedefault skin tone used for emoji with skin tone
   * support.
   */
  defaultSkinTone?: EmojiSkinTone;
}

const HEADER_ROW_HEIGHT = 48;
const EMOJI_ROW_HEIGHT = 34;
const EMOJIS_PER_ROW = 13;

type VirtualItem =
  | { type: 'header'; label: string }
  | { type: 'emojis'; emojis: EmojiItem[] };

function buildVirtualItems(
  resultsByGroup: [string, EmojiItem[]][],
): VirtualItem[] {
  const items: VirtualItem[] = [];

  for (const [group, emojis] of resultsByGroup) {
    items.push({ type: 'header', label: group });

    for (let i = 0; i < emojis.length; i += EMOJIS_PER_ROW) {
      items.push({
        type: 'emojis',
        emojis: emojis.slice(i, i + EMOJIS_PER_ROW),
      });
    }
  }

  return items;
}

export const EmojiPicker: FC<EmojiPickerProps> = ({
  onSelect,
  onSelectSkinTone,
  defaultSkinTone = 0,
  recent,
  className,
  ...other
}) => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [skinTone, setSkinTone] = useState(defaultSkinTone);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Get the emoji data, triggering its load on first use
  const emojiData = useEmojiData();

  const { results, resultsByGroup } = useMemo(() => {
    // Nothing to show until the data loads
    if (!emojiData) {
      return { results: [], resultsByGroup: [] };
    }

    // Show everything using the grouping computed at load time
    if (!deferredQuery) {
      return { results: emojiData.all, resultsByGroup: emojiData.grouped };
    }

    const results = emojiData.search(deferredQuery);

    return { results, resultsByGroup: Emoji.group(results) };
  }, [emojiData, deferredQuery]);

  const virtualItems = useMemo(
    () => buildVirtualItems(resultsByGroup),
    [resultsByGroup],
  );

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () =>
      scrollContainerRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: (index) =>
      virtualItems[index].type === 'header'
        ? HEADER_ROW_HEIGHT
        : EMOJI_ROW_HEIGHT,
    overscan: 5,
  });

  const handleSelect = useCallback(
    (value: EmojiItem) => {
      if (!onSelect) {
        return;
      }

      onSelect(Emoji.getSkinToneVariant(value, skinTone), skinTone);
    },
    [onSelect, skinTone],
  );

  const handleClickRandom = useCallback(() => {
    // No emoji to pick from until the data loads
    if (!emojiData) {
      return;
    }

    const randomEmoji =
      emojiData.all[Math.floor(Math.random() * emojiData.all.length)];

    handleSelect(randomEmoji);
  }, [emojiData, handleSelect]);

  const handleSelectSkinTone = useCallback(
    (value: EmojiSkinTone) => {
      setSkinTone(value);

      if (onSelectSkinTone) {
        onSelectSkinTone(value);
      }
    },
    [onSelectSkinTone],
  );

  const handleQueryChange = useCallback((value: string) => setQuery(value), []);

  return (
    <div className={propsToClass('emoji-picker', { className })} {...other}>
      <Toolbar className="emoji-picker-color-toolbar">
        {Emoji.skinTones.map((skinTone) => (
          <IconButton
            key={skinTone.value}
            label={`emojiPicker.skinTone.${skinTone.label}`}
            onClick={() => handleSelectSkinTone(skinTone.value)}
          >
            {Emoji.getSkinToneVariant(SkinToneSelectEmoji, skinTone.value)}
          </IconButton>
        ))}
      </Toolbar>
      <Toolbar>
        <TextField
          variant="ghost"
          placeholder="emojiPicker.filter"
          unassisted
          onValueChange={handleQueryChange}
        />
        <Tooltip title="emojiPicker.random">
          <IconButton
            icon="shuffle"
            label="emojiPicker.random"
            color="contrast"
            onClick={handleClickRandom}
          />
        </Tooltip>
      </Toolbar>
      <div className="emoji-picker-options">
        {results.length <= 60 && (
          <ScrollArea className="emoji-picker-scroll-area">
            <div className="emoji-picker-category-group-emoji">
              {results.map((emoji) => (
                <EmojiButton
                  key={emoji.name}
                  emoji={emoji}
                  skinTone={skinTone}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </ScrollArea>
        )}
        {results.length > 60 && (
          <ScrollArea
            key={virtualItems.length}
            ref={scrollContainerRef}
            className="emoji-picker-scroll-area"
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const item = virtualItems[virtualRow.index];

                if (item.type === 'header') {
                  return (
                    <div
                      key={virtualRow.key}
                      className="emoji-picker-category-group"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <MenuLabel>{item.label}</MenuLabel>
                    </div>
                  );
                }

                return (
                  <div
                    key={virtualRow.key}
                    className="emoji-picker-category-group-emoji"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {item.emojis.map((emoji) => (
                      <EmojiButton
                        key={emoji.name}
                        emoji={emoji}
                        skinTone={skinTone}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export const EmojiWithSkinTone: React.FC<{
  emoji: EmojiItem;
  skinTone: EmojiSkinTone;
}> = ({ emoji, skinTone }) => Emoji.getSkinToneVariant(emoji, skinTone);

const EmojiButton = memo<{
  emoji: EmojiItem;
  skinTone: EmojiSkinTone;
  onSelect: (value: EmojiItem) => void;
}>(({ emoji, skinTone, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(emoji), [onSelect, emoji]);

  return (
    <IconButton
      className="emoji-picker-emoji-button"
      stringLabel={emoji.name}
      onClick={handleSelect}
    >
      <EmojiWithSkinTone emoji={emoji} skinTone={skinTone} />
    </IconButton>
  );
});

EmojiButton.displayName = 'EmojiButton';

const SkinToneSelectEmoji: EmojiItem = {
  char: '🖖',
  name: '',
  group: '',
  labels: [],
  skinToneVariants: ['🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿'],
};
