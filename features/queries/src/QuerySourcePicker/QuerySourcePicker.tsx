import { useRef, useState } from 'react';
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

  /**
   * Called when the picker is dismissed without a selection.
   */
  onDismiss: () => void;
}

/**
 * Renders a placeholder card with a search box for picking the
 * database a new source node emits entries from.
 */
export const QuerySourcePicker: React.FC<QuerySourcePickerProps> = ({
  onSelect,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'queries.sourcePicker' });

  // All databases, offered as options when not searching
  const allDatabases = Databases.useAll();

  // Databases listed as options, fuzzy matched while searching
  const databases = query ? Databases.search(query) : allDatabases;

  // Dismiss the picker on Escape. The search field clears a
  // non-empty query itself and stops propagation, so only an
  // empty query reaches here.
  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      onDismiss();
    }
  }

  // Keep focus in the search input when pressing the picker's
  // other elements, so selection clicks never blur the input
  function handleMouseDown(event: React.MouseEvent): void {
    // Keep the press from reaching the canvas viewport, which
    // focuses itself on mousedown and would blur the input,
    // dismissing the picker before the selection click lands
    event.stopPropagation();

    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  // Dismiss the picker when focus leaves it. Selection clicks
  // never blur the input, so any blur out of the picker is an
  // outside interaction.
  function handleBlur(event: React.FocusEvent): void {
    // Focus moved within the picker
    if (
      event.relatedTarget &&
      containerRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }

    onDismiss();
  }

  return (
    <div
      ref={containerRef}
      className="queries-source-picker"
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onBlur={handleBlur}
    >
      <SearchableMenu
        scrollable
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
