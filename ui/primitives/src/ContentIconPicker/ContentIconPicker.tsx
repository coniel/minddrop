import { FC, useCallback, useEffect, useState } from 'react';
import { List } from 'react-window';
import { useTranslation } from '@minddrop/i18n';
import { ContentIconMetadata, ContentIconName } from '@minddrop/icons';
import { ContentIcon } from '../ContentIcon';
import { IconButton } from '../IconButton';
import { MenuLabel } from '../Menu';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { ContentColors } from '../constants';
import { ContentColor } from '../types';
import { mapPropsToClasses } from '../utils';
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
import { TextField } from '../fields/TextField';

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
const NAV_GROUP_HEADER_HEIGHT = 32 + 8;
// Height + margin
const ICON_SELECTION_BUTTON_HEIGHT = 34;
const ICON_SELECTION_BUTTONS_PER_ROW = 13;

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
      <div style={style} className="category-group">
        <MenuLabel key={category}>{category}</MenuLabel>
        <div className="category-group-icons">
          {categoryIcons.map((icon) => (
            <IconSelectButton
              key={icon.name}
              icon={icon}
              color={color}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={mapPropsToClasses({ className }, 'content-icon-picker')}
      {...other}
    >
      <Toolbar className="color-toolbar">
        {ContentColors.map((color) => (
          <ColorSelectButton
            key={color.value}
            color={color.value}
            onClick={handleSelectColor}
          />
        ))}
      </Toolbar>
      <Toolbar>
        <TextField
          variant="ghost"
          placeholder={t('filter')}
          autoComplete="off"
          onValueChange={(value) => setQuery(value)}
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
          <div className="category-group">
            {results.map((icon) => (
              <IconSelectButton
                key={icon.name}
                icon={icon}
                color={color}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
        {results.length > 60 && (
          // Use results length as key in order to force the entire
          // list to be re-rendered when category count/heights change.
          <div key={results.length}>
            <List
              rowCount={resultsByCategory.length}
              rowHeight={getCategoryItemSize}
              rowComponent={Category}
              // @ts-ignore - TODO: react-window types are incorrect, remove
              // when they are fixed.
              rowProps={{}}
            />
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
      <ContentIcon icon={`content-icon:${icon.name}`} color={color} />
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
      <div
        style={{
          backgroundColor: color === 'default' ? 'none' : `var(--${color}8)`,
          boxShadow:
            color === 'default'
              ? 'inset 0 0 0 1px var(--textNeutralLight)'
              : 'none',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
        }}
      />
    </IconButton>
  );
};
