import { FC, useCallback, useEffect, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { useTranslation } from '@minddrop/i18n';
import { Emoji, EmojiItem, EmojiSkinTone } from '@minddrop/icons';
import { mapPropsToClasses, useToggle } from '@minddrop/utils';
import { IconButton } from '../IconButton';
import { MenuLabel } from '../Menu';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { TextField } from '../TextField';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import './EmojiPicker.css';
import { InvisibleTextField } from '../InvisibleTextField';

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

// Margin top + title height
const NAV_GROUP_HEADER_HEIGHT = 32 + 16;
// Height + margin
const EMOJI_SELECTION_BUTTON_HEIGHT = 34;
const EMOJI_SELECTION_BUTTONS_PER_ROW = 13;

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
  const [results, setResults] = useState<EmojiItem[]>(Emoji.all);
  const [resultsByGroup, setResultsByGroup] = useState(Emoji.group(Emoji.all));
  const [skinTone, setSkinTone] = useState(defaultSkinTone);

  // Triggered by changes to the search query
  useEffect(() => {
    const results = Emoji.search(query);

    setResults(results);
    setResultsByGroup(Emoji.group(results));
  }, [query]);

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

  const getCategoryItemSize = useCallback(
    (index: number) => {
      return (
        NAV_GROUP_HEADER_HEIGHT +
        Math.ceil(
          resultsByGroup[index][1].length / EMOJI_SELECTION_BUTTONS_PER_ROW,
        ) *
          EMOJI_SELECTION_BUTTON_HEIGHT
      );
    },
    [resultsByGroup],
  );

  const Category = ({
    index,
    style,
  }: {
    index: number;
    style: React.HTMLAttributes<HTMLDivElement>['style'];
  }) => {
    const [category, categoryIcons] = resultsByGroup[index];

    return (
      <div style={style} className="category-group">
        <MenuLabel key={category}>{category}</MenuLabel>
        <div className="category-group-emoji">
          {categoryIcons.map((emoji) => (
            <EmojiButton
              key={emoji.name}
              emoji={emoji}
              skinTone={skinTone}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={mapPropsToClasses({ className }, 'emoji-picker')}
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
        <InvisibleTextField
          autoFocus
          label={t('filter')}
          placeholder={t('filter')}
          autoComplete="off"
          autoCorrect="off"
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Tooltip title={t('random')}>
          <IconButton
            icon="shuffle"
            label="random"
            color="light"
            onClick={handleClickRandom}
          />
        </Tooltip>
      </Toolbar>
      <div className="options">
        {results.length > 60 && (
          // Use results length as key in order to force the entire
          // list to be re-rendered when category count/heights change.
          <div key={results.length}>
            <List
              height={423}
              itemCount={resultsByGroup.length}
              itemSize={getCategoryItemSize}
              width={440}
            >
              {Category}
            </List>
          </div>
        )}
        {results.length <= 60 && (
          <div className="category-group">
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
      </div>
    </div>
  );
};

export const EmojiWithSkinTone: React.FC<{
  emoji: EmojiItem;
  skinTone: EmojiSkinTone;
}> = ({ emoji, skinTone }) => Emoji.getSkinToneVariant(emoji, skinTone);

const EmojiButton: React.FC<{
  emoji: EmojiItem;
  skinTone: EmojiSkinTone;
  onSelect: (value: EmojiItem) => void;
}> = ({ emoji, skinTone, onSelect }) => {
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
};

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
