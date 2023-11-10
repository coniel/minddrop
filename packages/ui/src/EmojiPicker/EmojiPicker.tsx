import { FC, useCallback, useEffect, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { mapPropsToClasses, useToggle } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { IconButton } from '../IconButton';
import { NavGroup } from '../NavGroup';
import { TextInput } from '../TextInput';
import { Toolbar } from '../Toolbar';
import { Emoji, MinifiedEmojiData, SkinTone } from './EmojiPicker.types';
import {
  getAllLabels,
  getSkinToneVariant,
  groupByGroup,
  searchEmoji,
  unminifyEmoji,
} from './utils';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { Tooltip } from '../Tooltip';
import emojiJsonData from './emoji.min.json';
import './EmojiPicker.css';

const emojiData = emojiJsonData as unknown as MinifiedEmojiData;

export interface EmojiPickerProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onSelect'> {
  /**
   * Calback fired when an emoji is selected.
   */
  onSelect?(emoji: string): void;

  /**
   * Callback fired when the clear button is clicked.
   */
  onClear?(): void;

  /**
   * Callback fired when a skin tone is selected.
   */
  onSelectSkinTone?(value: SkinTone): void;

  /**
   * Recently used emoji shown as the first category.
   */
  recent?: string[];

  /**
   * Thedefault skin tone used for emoji with skin tone
   * support.
   */
  defaultSkinTone?: SkinTone;
}

// Margin top + title height
const NAV_GROUP_HEADER_HEIGHT = 34;
// Height + margin
const EMOJI_SELECTION_BUTTON_HEIGHT = 34;
const EMOJI_SELECTION_BUTTONS_PER_ROW = 12;

const unminifiedEmoji = emojiData.emoji.map((minifiedEmoji) =>
  unminifyEmoji(minifiedEmoji, emojiData.groups, emojiData.subgroups),
);
const allLabels = getAllLabels(unminifiedEmoji);

const skinTones: { value: SkinTone; label: string }[] = [
  { value: 0, label: 'none' },
  { value: 1, label: 'light' },
  { value: 2, label: 'mediumLight' },
  { value: 3, label: 'medium' },
  { value: 4, label: 'mediumDark' },
  { value: 5, label: 'dark' },
];

export const EmojiPicker: FC<EmojiPickerProps> = ({
  onSelect,
  onClear,
  onSelectSkinTone,
  defaultSkinTone = 0,
  recent,
  className,
  ...other
}) => {
  const { t } = useTranslation('emojiPicker');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Emoji[]>(unminifiedEmoji);
  const [resultsByGroup, setResultsByGroup] = useState(
    groupByGroup(unminifiedEmoji),
  );
  const [skinTone, setSkinTone] = useState(defaultSkinTone);

  // Triggered by changes to the search query
  useEffect(() => {
    const results = searchEmoji(unminifiedEmoji, allLabels, query);

    setResults(results);
  }, [query]);

  const handleSelect = useCallback(
    (value: Emoji) => {
      if (!onSelect) {
        return;
      }

      onSelect(getSkinToneVariant(value, skinTone));
    },
    [onSelect, skinTone],
  );

  const handleClickRandom = useCallback(() => {
    const randomEmoji =
      unminifiedEmoji[Math.floor(Math.random() * unminifiedEmoji.length)];

    handleSelect(randomEmoji);
  }, [handleSelect]);

  const handleSelectSkinTone = useCallback(
    (value: SkinTone) => {
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
      <NavGroup key={category} title={category} style={style}>
        {categoryIcons.map((emoji) => (
          <EmojiButton
            key={emoji.name}
            emoji={emoji}
            skinTone={skinTone}
            onSelect={handleSelect}
          />
        ))}
      </NavGroup>
    );
  };

  return (
    <div
      className={mapPropsToClasses({ className }, 'emoji-picker')}
      {...other}
    >
      <Toolbar>
        <TextInput
          placeholder={t('filter')}
          autoComplete="off"
          autoCorrect="off"
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Tooltip title={t('random')}>
          <IconButton
            icon="shuffle-2"
            label="random"
            color="light"
            onClick={handleClickRandom}
          />
        </Tooltip>
        <SkinToneSelect
          selectedSkinTone={skinTone}
          onSelect={handleSelectSkinTone}
        />
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
              width={424}
            >
              {Category}
            </List>
          </div>
        )}
        {results.length <= 60 && (
          <NavGroup className="inline-results">
            {results.map((emoji) => (
              <EmojiButton
                key={emoji.name}
                emoji={emoji}
                skinTone={skinTone}
                onSelect={handleSelect}
              />
            ))}
          </NavGroup>
        )}
      </div>
    </div>
  );
};

export const EmojiWithSkinTone: React.FC<{
  emoji: Emoji;
  skinTone: SkinTone;
}> = ({ emoji, skinTone }) => getSkinToneVariant(emoji, skinTone);

const EmojiButton: React.FC<{
  emoji: Emoji;
  skinTone: SkinTone;
  onSelect: (value: Emoji) => void;
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

const SkinToneSelectEmoji: Emoji = {
  char: '🖖',
  name: '',
  group: '',
  labels: [],
  skinToneVariants: ['🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿'],
};

const SkinToneSelect: React.FC<{
  selectedSkinTone: SkinTone;
  onSelect: (value: SkinTone) => void;
}> = ({ onSelect, selectedSkinTone }) => {
  const { t } = useTranslation('emojiPicker.skinTone');
  const [popoverOpen, togglePopover, setPopoverOpen] = useToggle(false);

  const createSelectHandler = useCallback(
    (value: SkinTone) => {
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
              {getSkinToneVariant(SkinToneSelectEmoji, selectedSkinTone)}
            </IconButton>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent className="skin-tone-select-popover">
        {skinTones.map((skinTone) => (
          <IconButton
            key={skinTone.value}
            label={t(skinTone.label)}
            onClick={createSelectHandler(skinTone.value)}
          >
            {getSkinToneVariant(SkinToneSelectEmoji, skinTone.value)}
          </IconButton>
        ))}
      </PopoverContent>
    </Popover>
  );
};
