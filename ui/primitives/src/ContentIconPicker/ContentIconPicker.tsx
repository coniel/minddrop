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
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  BuiltInContentIconSetId,
  ContentIconName,
  Icons,
  LoadedContentIconSet,
  UnminifiedContentIcon,
  UserIconType,
  groupByCategory,
  useLoadedContentIconSets,
} from '@minddrop/ui-icons';
import { ContentColor } from '@minddrop/ui-theme';
import { Button } from '../Button';
import { ContentIcon } from '../ContentIcon';
import { IconButton } from '../IconButton';
import { MenuLabel } from '../Menu';
import { ScrollArea } from '../ScrollArea';
import { Toolbar } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { ContentColorValues } from '../constants';
import { propsToClass } from '../utils';
import './ContentIconPicker.css';
import { TextField } from '../fields/TextField';

export interface ContentIconPickerProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onSelect'> {
  /**
   * Calback fired when an icon is selected.
   */
  onSelect?(icon: ContentIconName, color: ContentColor, set: string): void;

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

export const ContentIconPicker: FC<ContentIconPickerProps> = ({
  onSelect,
  onSelectColor,
  recent,
  defaultColor = 'default',
  className,
  ...other
}) => {
  const [query, setQuery] = useState('');
  // useDeferredValue keeps the search input responsive — React shows the
  // previous results immediately while computing new ones at low priority.
  const deferredQuery = useDeferredValue(query);
  const [color, setColor] = useState<ContentColor>(defaultColor);
  const [activeSetId, setActiveSetId] = useState(BuiltInContentIconSetId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const iconSets = useLoadedContentIconSets();

  // The set whose icons are listed
  const activeSet = useMemo(
    () =>
      iconSets?.find((set) => set.id === activeSetId) || iconSets?.[0] || null,
    [iconSets, activeSetId],
  );

  const { results, resultsByCategory } = useMemo(() => {
    // Nothing to show until the sets load
    if (!activeSet) {
      return { results: [], resultsByCategory: [] };
    }

    // Show the set's icons when not searching, using the category
    // grouping computed when the set loaded
    if (!deferredQuery) {
      return {
        results: activeSet.icons,
        resultsByCategory: activeSet.iconsByCategory,
      };
    }

    // Search within the active set
    const results = activeSet.search(deferredQuery);

    return { results, resultsByCategory: groupByCategory(results) };
  }, [activeSet, deferredQuery]);

  const virtualItems = useMemo(
    () => buildVirtualItems(resultsByCategory),
    [resultsByCategory],
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
        : ICON_ROW_HEIGHT,
    overscan: 5,
  });

  const handleSelect = useCallback(
    (value: UnminifiedContentIcon) => {
      if (!onSelect) {
        return;
      }

      onSelect(value.name, color, value.set);
    },
    [onSelect, color],
  );

  const handleClickRandom = useCallback(() => {
    // No icons to pick from until the sets load
    if (!activeSet) {
      return;
    }

    // Pick from the active set's icons
    const randomIcon =
      activeSet.icons[Math.floor(Math.random() * activeSet.icons.length)];

    handleSelect(randomIcon);
  }, [activeSet, handleSelect]);

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

  return (
    <div
      className={propsToClass('content-icon-picker', { className })}
      {...other}
    >
      {iconSets && iconSets.length > 1 && (
        <Toolbar className="set-toolbar">
          {iconSets.map((set) => (
            <SetSelectButton
              key={set.id}
              set={set}
              active={set.id === activeSet?.id}
              onClick={setActiveSetId}
            />
          ))}
        </Toolbar>
      )}
      <Toolbar className="color-toolbar">
        {ContentColorValues.map((color) => (
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
          placeholder="iconPicker.filter"
          unassisted
          onValueChange={handleQueryChange}
        />
        <Tooltip title="iconPicker.random">
          <IconButton
            icon="shuffle"
            label="iconPicker.random"
            color="contrast"
            onClick={handleClickRandom}
          />
        </Tooltip>
      </Toolbar>
      <div className="options">
        {results.length <= 60 && (
          <ScrollArea style={{ flex: 1, minHeight: 0 }}>
            <div className="category-group-icons">
              {results.map((icon) => (
                <IconSelectButton
                  key={`${icon.set}:${icon.name}`}
                  icon={icon}
                  color={color}
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
            style={{ flex: 1, minHeight: 0 }}
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
                      className="category-group"
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
                    className="category-group-icons"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {item.icons.map((icon) => (
                      <IconSelectButton
                        key={`${icon.set}:${icon.name}`}
                        icon={icon}
                        color={color}
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

const SetSelectButton: React.FC<{
  set: LoadedContentIconSet;
  active: boolean;
  onClick: (setId: string) => void;
}> = ({ set, active, onClick }) => {
  const handleClick = useCallback(() => onClick(set.id), [onClick, set.id]);

  // The built-in set is labelled with a translated default name
  if (set.id === BuiltInContentIconSetId) {
    return (
      <Button
        label="iconPicker.defaultSet"
        variant={active ? 'filled' : 'ghost'}
        onClick={handleClick}
      />
    );
  }

  // Custom sets are labelled with their display name
  return (
    <Button variant={active ? 'filled' : 'ghost'} onClick={handleClick}>
      {set.name}
    </Button>
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
      stringLabel={icon.name}
      onClick={handleSelect}
    >
      <ContentIcon
        icon={Icons.stringify({
          type: UserIconType.ContentIcon,
          set: icon.set,
          icon: icon.name,
          color,
        })}
        color={color}
      />
    </IconButton>
  );
});

const colorKey = createI18nKeyBuilder('color.');

const ColorSelectButton: React.FC<{
  color: ContentColor;
  onClick: (value: ContentColor) => void;
}> = ({ color, onClick }) => {
  const handleSelect = useCallback(() => {
    onClick(color);
  }, [color, onClick]);

  return (
    <IconButton
      label={colorKey(color)}
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

IconSelectButton.displayName = 'IconSelectButton';
