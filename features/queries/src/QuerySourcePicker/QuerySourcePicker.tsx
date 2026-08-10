import { useState } from 'react';
import { DatabaseId, Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { SearchableMenu, SearchableMenuItem } from '@minddrop/ui-primitives';
import { SOURCE_FALLBACK_ICON } from '../constants';
import './QuerySourcePicker.css';

export interface QuerySourcePickerProps {
  /**
   * Called with the picked database.
   */
  onSelect: (databaseId: DatabaseId) => void;
}

/**
 * Renders a search box with a database list for picking the
 * database a source node emits entries from.
 */
export const QuerySourcePicker: React.FC<QuerySourcePickerProps> = ({
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'queries.sourcePicker' });

  // All databases, offered as options when not searching
  const allDatabases = Databases.useAll();

  // Databases listed as options, fuzzy matched while searching
  const databases = query ? Databases.search(query) : allDatabases;

  // Keep focus in the search input when pressing the picker's
  // other elements, so selection clicks never blur the input
  function handleMouseDown(event: React.MouseEvent): void {
    // Keep the press from reaching the canvas viewport, which
    // focuses itself on mousedown and would blur the input
    // before the selection click lands
    event.stopPropagation();

    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  return (
    <div className="queries-source-picker" onMouseDown={handleMouseDown}>
      <SearchableMenu
        scrollable
        searchVariant="outline"
        searchTerm={query}
        onSearchTermChange={setQuery}
        searchPlaceholder="queries.sourcePicker.searchPlaceholder"
        emptyText={t('empty')}
      >
        {databases.map((database) => (
          <SearchableMenuItem
            key={database.id}
            stringLabel={database.name}
            contentIcon={database.icon || SOURCE_FALLBACK_ICON}
            onSelect={() => onSelect(database.id)}
          />
        ))}
      </SearchableMenu>
    </div>
  );
};
