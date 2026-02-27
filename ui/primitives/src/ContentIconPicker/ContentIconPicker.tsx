import {
  FC,
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from 'react';
import { List } from 'react-window';
import { useTranslation } from '@minddrop/i18n';
import { ContentIconMetadata, ContentIconName } from '@minddrop/icons';
import { ContentIcon } from '../ContentIcon';
import { IconButton } from '../IconButton';
import { MenuLabel } from '../Menu';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { ContentColors } from '../constants';
import { ContentColor } from '@minddrop/theme';
import { propsToClass } from '../utils';
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

// Pre-compute initial state at module level so the first mount
// has nothing to compute.
const initialResultsByCategory = groupByCategory(unminifiedIcons);

// Fixed row heights for the flat virtual grid
const HEADER_ROW_HEIGHT = 40;
const ICON_ROW_HEIGHT = 34;
const ICONS_PER_ROW = 13;

type VirtualItem =
  | { type: 'header'; label: string }
  | { type: 'icons'; icons: UnminifiedContentIcon[] };

function buildVirtualItems(
  resultsByCategory: [string, UnminifiedContentIcon[]][],
): VirtualItem[] {
  const items: VirtualItem[] = [];

  for (const [category, icons] of resultsByCategory) {
    items.push({ type: 'header', label: category });

    for (let i = 0; i < icons.length; i += ICONS_PER_ROW) {
      items.push({ type: 'icons', icons: icons.slice(i, i + ICONS_PER_ROW) });
    }
  }

  return items;
}

// Pre-compute initial virtual items at module level.
const initialVirtualItems = buildVirtualItems(initialResultsByCategory);

interface VirtualRowProps {
  index: number;
  style: React.CSSProperties;
  virtualItems: VirtualItem[];
  color: ContentColor;
  onSelect: (icon: UnminifiedContentIcon) => void;
}

// Defined outside the component for stable identity — react-window unmounts
// and remounts all rows whenever rowComponent's type changes, so an inline
// definition would cause a full remount on every parent render.
const VirtualRow = memo(
  ({ index, style, virtualItems, color, onSelect }: VirtualRowProps) => {
    const item = virtualItems[index];

    if (item.type === 'header') {
      return (
        <div style={style} className="category-group">
          <MenuLabel>{item.label}</MenuLabel>
        </div>
      );
    }

    return (
      <div style={style} className="category-group-icons">
        {item.icons.map((icon) => (
          <IconSelectButton
            key={icon.name}
            icon={icon}
            color={color}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
);

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
  // useDeferredValue keeps the search input responsive — React shows the
  // previous results immediately while computing new ones at low priority.
  const deferredQuery = useDeferredValue(query);
  const [color, setColor] = useState<ContentColor>(defaultColor);

  const { results, resultsByCategory } = useMemo(() => {
    // Skip recomputation for the initial empty-query case.
    if (!deferredQuery) {
      return {
        results: unminifiedIcons,
        resultsByCategory: initialResultsByCategory,
      };
    }

    const results = searchContentIcons(
      unminifiedIcons,
      allLabels,
      deferredQuery,
    );

    return { results, resultsByCategory: groupByCategory(results) };
  }, [deferredQuery]);

  const virtualItems = useMemo(
    () =>
      deferredQuery
        ? buildVirtualItems(resultsByCategory)
        : initialVirtualItems,
    [deferredQuery, resultsByCategory],
  );

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

  const handleQueryChange = useCallback((value: string) => setQuery(value), []);

  const getItemSize = useCallback(
    (index: number) =>
      virtualItems[index].type === 'header'
        ? HEADER_ROW_HEIGHT
        : ICON_ROW_HEIGHT,
    [virtualItems],
  );

  // Memoized so react-window only re-renders rows when these values change.
  const rowProps = useMemo(
    () => ({ virtualItems, color, onSelect: handleSelect }),
    [virtualItems, color, handleSelect],
  );

  return (
    <div
      className={propsToClass('content-icon-picker', { className })}
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
          <div className="category-group-icons" style={{ overflowY: 'auto' }}>
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
          // Key on virtualItems.length so the list remounts when the number
          // of rows changes (avoids stale row heights after filtering).
          // flex+minHeight give the List a bounded height so its ResizeObserver
          // reports the visible area rather than the full content height.
          <div key={virtualItems.length} style={{ flex: 1, minHeight: 0 }}>
            <List
              rowCount={virtualItems.length}
              rowHeight={getItemSize}
              // @ts-ignore - TODO: react-window types are incorrect, remove
              // when they are fixed.
              rowComponent={VirtualRow}
              // @ts-ignore
              rowProps={rowProps}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const IconSelectButton = memo<{
  icon: UnminifiedContentIcon;
  color: ContentColor;
  onSelect: (value: UnminifiedContentIcon) => void;
}>(({ icon, color, onSelect }) => {
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
});

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
          backgroundColor:
            color === 'default' ? 'transparent' : `var(--${color}-900)`,
          boxShadow:
            color === 'default'
              ? 'inset 0 0 0 1.5px var(--border-default)'
              : 'none',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
        }}
      />
    </IconButton>
  );
};
