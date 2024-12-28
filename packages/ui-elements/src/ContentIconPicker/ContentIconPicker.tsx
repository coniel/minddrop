import { FC, useCallback, useEffect, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { useTranslation } from '@minddrop/i18n';
import { ContentIconMetadata, ContentIconName } from '@minddrop/icons';
import { mapPropsToClasses, useToggle } from '@minddrop/utils';
import { ContentIcon } from '../ContentIcon';
import { IconButton } from '../IconButton';
import { NavGroup } from '../NavGroup';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { TextInput } from '../TextInput';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { ContentColors } from '../constants';
import { ContentColor } from '../types';
import {
  MinifiedContentIcon,
  UnminifiedContentIcon,
} from './ContentIconPicker.types';
import {
  getAllLabels,
  groupByCategory,
  searchContentIcons,
  unminifyContentIcon,
} from './utils';
import './ContentIconPicker.css';

export interface ContentIconPickerProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onSelect'> {
  /**
   * Calback fired when an icon is selected.
   */
  onSelect?(icon: ContentIconName, color: ContentColor): void;

  /**
   * Calback fired when an icon color is selected.
   */
  onSelectColor?(color: ContentColor): void;

  /**
   * The default selected color.
   */
  defaultColor?: ContentColor;

  /**
   * Recently used icons shown as the first category.
   */
  recent?: string[];
}

const unminifiedIcons = ContentIconMetadata.icons.map((icon) =>
  unminifyContentIcon(
    icon as MinifiedContentIcon,
    ContentIconMetadata.categories,
    ContentIconMetadata.labels,
  ),
);

const allLabels = getAllLabels(unminifiedIcons);

// Margin top + title height
const NAV_GROUP_HEADER_HEIGHT = 34;
// Height + margin
const ICON_SELECTION_BUTTON_HEIGHT = 34;
const ICON_SELECTION_BUTTONS_PER_ROW = 12;

export const ContentIconPicker: FC<ContentIconPickerProps> = ({
  onSelect,
  onSelectColor,
  recent,
  defaultColor = 'default',
  className,
  ...other
}) => {
  const { t } = useTranslation({ keyPrefix: 'iconPicker' });
  const [query, setQuery] = useState('');
  const [results, setResults] =
    useState<UnminifiedContentIcon[]>(unminifiedIcons);
  const [resultsByCategory, setResultsByCategory] = useState(
    groupByCategory(unminifiedIcons),
  );
  const [color, setColor] = useState<ContentColor>(defaultColor);

  // Triggered by changes to the search query
  useEffect(() => {
    const results = searchContentIcons(unminifiedIcons, allLabels, query);

    setResults(results);
    setResultsByCategory(groupByCategory(results));
  }, [query]);

  const handleSelect = useCallback(
    (value: UnminifiedContentIcon) => {
      if (!onSelect) {
        return;
      }

      onSelect(value.name, color);
    },
    [onSelect, color],
  );

  const handleClickRandom = useCallback(() => {
    const randomIcon =
      unminifiedIcons[Math.floor(Math.random() * unminifiedIcons.length)];

    handleSelect(randomIcon);
  }, [handleSelect]);

  const handleSelectColor = useCallback(
    (value: ContentColor) => {
      setColor(value);

      if (onSelectColor) {
        onSelectColor(value);
      }
    },
    [onSelectColor],
  );

  const getCategoryItemSize = useCallback(
    (index: number) => {
      return (
        NAV_GROUP_HEADER_HEIGHT +
        Math.ceil(
          resultsByCategory[index][1].length / ICON_SELECTION_BUTTONS_PER_ROW,
        ) *
          ICON_SELECTION_BUTTON_HEIGHT
      );
    },
    [resultsByCategory],
  );

  const Category = ({
    index,
    style,
  }: {
    index: number;
    style: React.HTMLAttributes<HTMLDivElement>['style'];
  }) => {
    const [category, categoryIcons] = resultsByCategory[index];

    return (
      <NavGroup key={category} title={category} style={style}>
        {categoryIcons.map((icon) => (
          <IconSelectButton
            key={icon.name}
            icon={icon}
            color={color}
            onSelect={handleSelect}
          />
        ))}
      </NavGroup>
    );
  };

  return (
    <div
      className={mapPropsToClasses({ className }, 'content-icon-picker')}
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
        <IconColorSelect selectedColor={color} onSelect={handleSelectColor} />
      </Toolbar>
      <div className="options">
        {results.length <= 60 && (
          <NavGroup className="inline-results">
            {results.map((icon) => (
              <IconSelectButton
                key={icon.name}
                icon={icon}
                color={color}
                onSelect={handleSelect}
              />
            ))}
          </NavGroup>
        )}
        {results.length > 60 && (
          // Use results length as key in order to force the entire
          // list to be re-rendered when category count/heights change.
          <div key={results.length}>
            <List
              height={423}
              itemCount={resultsByCategory.length}
              itemSize={getCategoryItemSize}
              width={424}
            >
              {Category}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

const IconSelectButton: React.FC<{
  icon: UnminifiedContentIcon;
  color: ContentColor;
  onSelect: (value: UnminifiedContentIcon) => void;
}> = ({ icon, color, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(icon), [onSelect, icon]);

  return (
    <IconButton
      className="icon-selection-button"
      label={icon.name}
      onClick={handleSelect}
    >
      <ContentIcon name={icon.name} color={color} />
    </IconButton>
  );
};

const ColorSelectButton: React.FC<{
  color: ContentColor;
  onClick: (value: ContentColor) => void;
}> = ({ color, onClick }) => {
  const { t } = useTranslation({ keyPrefix: 'color' });

  const handleSelect = useCallback(() => {
    onClick(color);
  }, [color, onClick]);

  return (
    <IconButton
      label={t(color)}
      className="color-selection-button"
      onClick={handleSelect}
    >
      <ContentIcon name="palette" color={color} />
    </IconButton>
  );
};

const IconColorSelect: React.FC<{
  selectedColor: ContentColor;
  onSelect: (value: ContentColor) => void;
}> = ({ onSelect, selectedColor }) => {
  const { t } = useTranslation({ keyPrefix: 'iconPicker' });
  const [popoverOpen, togglePopover, setPopoverOpen] = useToggle(false);

  const handleOnClickColor = useCallback(
    (value: ContentColor) => {
      togglePopover();
      onSelect(value);
    },
    [onSelect, togglePopover],
  );

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <div>
          <Tooltip title={t('selectColor')}>
            <IconButton
              className="color-select-button"
              label={t('selectedColor')}
              onClick={togglePopover}
            >
              <ContentIcon name="palette" color={selectedColor} />
            </IconButton>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent className="color-select-popover">
        {ContentColors.map((color) => (
          <ColorSelectButton
            key={color.value}
            color={color.value}
            onClick={handleOnClickColor}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
};
