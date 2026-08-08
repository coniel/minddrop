import { FC, useCallback, useMemo, useState } from 'react';
import { Collection, Collections } from '@minddrop/collections';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSearchableMenuItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
} from '@minddrop/ui-primitives';

// Maximum number of collections listed when not searching
const DEFAULT_COLLECTIONS_LIMIT = 10;

export interface CollectionSelectionSubmenuProps {
  /**
   * The collections offered as options.
   */
  collections: Collection[];

  /**
   * Called with the selected collection's ID.
   */
  onSelect: (collectionId: string) => void;

  /**
   * Label for the submenu trigger item.
   * @default 'collections.selection.addTo'
   */
  label?: TranslationKey;

  /**
   * Icon for the submenu trigger item.
   * @default 'library'
   */
  icon?: UiIconName;

  /**
   * Minimum width of the submenu popup.
   * @default 240
   */
  popupWidth?: number;
}

/**
 * Renders a submenu containing a searchable list of collections.
 * Lists the most recently modified collections when not searching.
 */
export const CollectionSelectionSubmenu: FC<
  CollectionSelectionSubmenuProps
> = ({
  collections,
  onSelect,
  label = 'collections.selection.addTo',
  icon = 'library',
  popupWidth = 240,
}) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'collections.selection' });

  // Most recently modified collections, listed when not searching
  const recentCollections = useMemo(
    () =>
      [...collections]
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, DEFAULT_COLLECTIONS_LIMIT),
    [collections],
  );

  // Collections offered as options: top fuzzy matches when
  // searching, most recently modified otherwise
  const listedCollections = useMemo(
    () =>
      query
        ? Collections.search(
            query,
            collections.map((collection) => collection.id),
          )
        : recentCollections,
    [query, collections, recentCollections],
  );

  // Reset the search query when the submenu opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setQuery('');
    }
  }, []);

  return (
    <DropdownSubmenu onOpenChange={handleOpenChange}>
      <DropdownSubmenuTriggerItem icon={icon} label={label} />
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
          <DropdownSubmenuContent
            searchable
            minWidth={popupWidth}
            searchPlaceholder="collections.selection.searchPlaceholder"
            searchTerm={query}
            onSearchTermChange={setQuery}
            emptyText={t('empty')}
          >
            {listedCollections.map((collection) => (
              <DropdownSearchableMenuItem
                key={collection.id}
                icon="library"
                stringLabel={collection.name}
                onSelect={() => onSelect(collection.id)}
              />
            ))}
          </DropdownSubmenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownSubmenu>
  );
};
