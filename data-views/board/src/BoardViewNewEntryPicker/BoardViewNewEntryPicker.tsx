import React, { useEffect, useRef, useState } from 'react';
import {
  Database,
  DatabaseEntryTemplate,
  DatabaseId,
  Databases,
} from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { DATABASE_FALLBACK_ICON } from '@minddrop/ui-components';
import {
  Group,
  KeyboardShortcut,
  SearchableMenu,
  SearchableMenuItem,
  Text,
} from '@minddrop/ui-primitives';
import './BoardViewNewEntryPicker.css';

export interface BoardViewNewEntryPickerProps {
  /**
   * Called with the picked database, and the picked entry template
   * when the entry is created from one.
   */
  onSelect: (databaseId: DatabaseId, templateId?: string) => void;

  /**
   * Called with the picked database and template on secondary
   * (shift) selection, after which the picker stays open for
   * creating further entries.
   */
  onSecondarySelect: (databaseId: DatabaseId, templateId?: string) => void;

  /**
   * Called when the picker is dismissed without a selection.
   */
  onDismiss: () => void;
}

/**
 * Renders a placeholder card with a search box for picking the
 * database, or database entry template, to create a new entry from.
 */
export const BoardViewNewEntryPicker: React.FC<
  BoardViewNewEntryPickerProps
> = ({ onSelect, onSecondarySelect, onDismiss }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'dataViews.board' });

  // All databases, offered as options when not searching
  const allDatabases = Databases.useAll();

  // Databases listed as options, fuzzy matched while searching
  const databases = query ? Databases.search(query) : allDatabases;

  // Templates matched by name while searching. Templates of a
  // matched database are already listed under it, so only templates
  // from other databases are added.
  const matchedTemplates = query
    ? Databases.searchEntryTemplates(query).filter(
        (result) =>
          !databases.some((database) => database.id === result.database.id),
      )
    : [];

  // Bring the picker into view if the drop position only
  // partially fit on screen. Runs a frame after the search
  // input's scroll-free auto-focus.
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollIntoView);
    });
  }, []);

  // Dismiss the picker on Escape. The search field clears a
  // non-empty query itself and stops propagation, so only an
  // empty query reaches here.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      onDismiss();
    }
  }

  // Keep focus in the search input when pressing the picker's
  // other elements, so selection clicks never blur the input
  function handleMouseDown(event: React.MouseEvent) {
    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  // Dismiss the picker when focus leaves it. Selection clicks
  // never blur the input, so any blur out of the picker is an
  // outside interaction.
  function handleBlur(event: React.FocusEvent) {
    // Focus moved within the picker
    if (
      event.relatedTarget &&
      containerRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }

    onDismiss();
  }

  // Select an option but keep the picker open for creating
  // further entries
  function handleSecondarySelect(databaseId: DatabaseId, templateId?: string) {
    onSecondarySelect(databaseId, templateId);

    // Keep the picker in view once the created entry has pushed
    // it down. Deferred to the frame after the layout update.
    requestAnimationFrame(scrollIntoView);
  }

  // Scroll the picker fully into view within the board
  function scrollIntoView() {
    containerRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  // Render a database option labelled with its entry name. While
  // searching, the database's entry templates are listed after it.
  function renderDatabaseItems(database: Database) {
    // The database's own option, creating a blank entry
    const items = [
      <SearchableMenuItem
        key={database.id}
        stringLabel={database.entryName}
        contentIcon={database.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => onSelect(database.id)}
        secondaryOnSelect={() => handleSecondarySelect(database.id)}
      />,
    ];

    // Templates are only offered among search results
    if (query) {
      items.push(
        ...(database.entryTemplates ?? []).map((template) =>
          renderTemplateItem(database, template),
        ),
      );
    }

    return items;
  }

  // Render a template option, qualified by the database's entry
  // name to stay distinguishable in the flat results list
  function renderTemplateItem(
    database: Database,
    template: DatabaseEntryTemplate,
  ) {
    return (
      <SearchableMenuItem
        key={`${database.id}:${template.id}`}
        stringLabel={`${database.entryName} · ${template.name}`}
        contentIcon={database.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => onSelect(database.id, template.id)}
        secondaryOnSelect={() =>
          handleSecondarySelect(database.id, template.id)
        }
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="board-view-new-entry-picker"
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onBlur={handleBlur}
    >
      <SearchableMenu
        scrollable
        searchTerm={query}
        onSearchTermChange={setQuery}
        searchPlaceholder="dataViews.board.searchDatabasesPlaceholder"
        emptyText={t('databaseSearchEmpty')}
      >
        {databases.flatMap(renderDatabaseItems)}
        {matchedTemplates.map((result) =>
          renderTemplateItem(result.database, result.template),
        )}
      </SearchableMenu>

      {/* Keyboard hint */}
      <Group gap={1} className="board-view-new-entry-picker-hint">
        <KeyboardShortcut keys={['Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('newEntryPickerCreateHint')}
        </Text>
        <Text size="xs" color="subtle">
          ·
        </Text>
        <KeyboardShortcut keys={['Shift', 'Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('newEntryPickerCreateMoreHint')}
        </Text>
      </Group>
    </div>
  );
};
