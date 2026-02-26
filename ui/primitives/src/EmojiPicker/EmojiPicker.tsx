import { FC, memo, useCallback, useDeferredValue, useMemo, useState } from 'react';
import { List } from 'react-window';
import { useTranslation } from '@minddrop/i18n';
import { Emoji, EmojiItem, EmojiSkinTone } from '@minddrop/icons';
import { useToggle } from '@minddrop/utils';
import { propsToClass } from '../utils';
import { IconButton } from '../IconButton';
import { TextField } from '../fields/TextField';
import { MenuLabel } from '../Menu';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
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

// Pre-compute initial state at module level so the first mount
// has nothing to compute.
const initialResultsByGroup = Emoji.group(Emoji.all);

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
      items.push({ type: 'emojis', emojis: emojis.slice(i, i + EMOJIS_PER_ROW) });
    }
  }

  return items;
}

const initialVirtualItems = buildVirtualItems(initialResultsByGroup);

interface VirtualRowProps {
  index: number;
  style: React.CSSProperties;
  virtualItems: VirtualItem[];
  skinTone: EmojiSkinTone;
  onSelect: (emoji: EmojiItem) => void;
}

// Defined outside the component for stable identity — react-window unmounts
// and remounts all rows whenever rowComponent's type changes, so an inline
// definition would cause a full remount on every parent render.
const VirtualRow = memo(
  ({ index, style, virtualItems, skinTone, onSelect }: VirtualRowProps): React.ReactElement => {
    const item = virtualItems[index];

    if (item.type === 'header') {
      return (
        <div style={style} className="category-group">
          <MenuLabel>{item.label}</MenuLabel>
        </div>
      );
    }

    return (
      <div style={style} className="category-group-emoji">
        {item.emojis.map((emoji) => (
          <EmojiButton
            key={emoji.name}
            emoji={emoji}
            skinTone={skinTone}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
);

export const EmojiPicker: FC<EmojiPickerProps> = ({
  onSelect,
  onSelectSkinTone,
  defaultSkinTone = 0,
  recent,
  className,
  ...other
}) => {
  const { t } = useTranslation({ keyPrefix: 'emojiPicker' });
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [skinTone, setSkinTone] = useState(defaultSkinTone);

  const { results, resultsByGroup } = useMemo(() => {
    if (!deferredQuery) {
      return { results: Emoji.all, resultsByGroup: initialResultsByGroup };
    }

    const results = Emoji.search(deferredQuery);

    return { results, resultsByGroup: Emoji.group(results) };
  }, [deferredQuery]);

  const virtualItems = useMemo(
    () =>
      deferredQuery ? buildVirtualItems(resultsByGroup) : initialVirtualItems,
    [deferredQuery, resultsByGroup],
  );

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
    const randomEmoji = Emoji.all[Math.floor(Math.random() * Emoji.all.length)];

    handleSelect(randomEmoji);
  }, [handleSelect]);

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

  const getItemSize = useCallback(
    (index: number) =>
      virtualItems[index].type === 'header' ? HEADER_ROW_HEIGHT : EMOJI_ROW_HEIGHT,
    [virtualItems],
  );

  const rowProps = useMemo(
    () => ({ virtualItems, skinTone, onSelect: handleSelect }),
    [virtualItems, skinTone, handleSelect],
  );

  return (
    <div
      className={propsToClass('emoji-picker', { className })}
      {...other}
    >
      <Toolbar className="color-toolbar">
        {Emoji.skinTones.map((skinTone) => (
          <IconButton
            key={skinTone.value}
            label={t(skinTone.label)}
            onClick={() => handleSelectSkinTone(skinTone.value)}
          >
            {Emoji.getSkinToneVariant(SkinToneSelectEmoji, skinTone.value)}
          </IconButton>
        ))}
      </Toolbar>
      <Toolbar>
        <TextField
          variant="ghost"
          placeholder={t('filter')}
          autoComplete="off"
          onValueChange={handleQueryChange}
        />
        <Tooltip title={t('random')}>
          <IconButton
            icon="shuffle"
            label="random"
            color="contrast"
            onClick={handleClickRandom}
          />
        </Tooltip>
      </Toolbar>
      <div className="options">
        {results.length <= 60 && (
          <div className="category-group-emoji" style={{ overflowY: 'auto' }}>
            {results.map((emoji) => (
              <EmojiButton
                key={emoji.name}
                emoji={emoji}
                skinTone={skinTone}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
        {results.length > 60 && (
          <div key={virtualItems.length} style={{ flex: 1, minHeight: 0 }}>
            <List
              rowCount={virtualItems.length}
              rowHeight={getItemSize}
              // @ts-ignore - TODO: react-window types are incorrect, remove
              // when they are fixed.
              rowComponent={VirtualRow}
              // @ts-ignore - TODO: react-window types are incorrect, remove
              // when they are fixed.
              rowProps={rowProps}
            />
          </div>
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
      className="emoji-button"
      label={emoji.name}
      onClick={handleSelect}
    >
      <EmojiWithSkinTone emoji={emoji} skinTone={skinTone} />
    </IconButton>
  );
});

const SkinToneSelectEmoji: EmojiItem = {
  char: '🖖',
  name: '',
  group: '',
  labels: [],
  skinToneVariants: ['🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿'],
};

const SkinToneSelect: React.FC<{
  selectedSkinTone: EmojiSkinTone;
  onSelect: (value: EmojiSkinTone) => void;
}> = ({ onSelect, selectedSkinTone }) => {
  const { t } = useTranslation({ keyPrefix: 'emojiPicker.skinTone' });
  const [popoverOpen, togglePopover, setPopoverOpen] = useToggle(false);

  const createSelectHandler = useCallback(
    (value: EmojiSkinTone) => {
      return () => {
        togglePopover();
        onSelect(value);
      };
    },
    [onSelect, togglePopover],
  );

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <div>
          <Tooltip title={t('action')}>
            <IconButton
              label={t('action')}
              className="open-skin-tone-popover-button"
              onClick={togglePopover}
            >
              {Emoji.getSkinToneVariant(SkinToneSelectEmoji, selectedSkinTone)}
            </IconButton>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent className="skin-tone-select-popover">
        {Emoji.skinTones.map((skinTone) => (
          <IconButton
            key={skinTone.value}
            label={t(skinTone.label)}
            onClick={createSelectHandler(skinTone.value)}
          >
            {Emoji.getSkinToneVariant(SkinToneSelectEmoji, skinTone.value)}
          </IconButton>
        ))}
      </PopoverContent>
    </Popover>
  );
};
