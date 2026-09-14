import { useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { SearchableMenu, SearchableMenuItem } from '@minddrop/ui-primitives';
import { EntitySearchOption, EntitySearchTypes } from './EntitySearchTypes';

// Entities listed before anything has been searched for
const DefaultLimit = 10;

export interface EntitySearchMenuProps {
  /**
   * The entity types the menu lists, matching the type prefix of
   * their IDs. Every type it supports when omitted.
   */
  types?: string[];

  /**
   * How many entities are listed before anything is searched for.
   *
   * @default 10
   */
  limit?: number;

  /**
   * The IDs of the entities the consumer already holds, which the
   * list leaves out: there is nothing to pick about them.
   */
  excludeIds?: string[];

  /**
   * Called with the picked entity's ID.
   */
  onSelect: (entityId: string) => void;

  /**
   * Placeholder shown in the search field.
   */
  searchPlaceholder?: TranslationKey;

  /**
   * Text shown when nothing matches the search.
   */
  emptyText?: string;

  /**
   * Whether the list is capped in height and scrolls.
   *
   * @default true
   */
  scrollable?: boolean;

  /**
   * Class name applied to the menu.
   */
  className?: string;
}

/**
 * Renders a searchable menu of the workspace's entities: the most
 * recent ones across the given types until something is searched
 * for, and the matches per type after that.
 */
export const EntitySearchMenu: React.FC<EntitySearchMenuProps> = ({
  types,
  limit = DefaultLimit,
  excludeIds = [],
  onSelect,
  searchPlaceholder,
  emptyText,
  scrollable = true,
  className,
}) => {
  const [query, setQuery] = useState('');

  // The types to list, which is all of them unless told otherwise
  const listedTypes = EntitySearchTypes.filter(
    (config) => !types || types.includes(config.type),
  );

  const options = query ? resolveMatchedOptions() : resolveRecentOptions();

  // The entities matching the search, type by type in the order the
  // types were given.
  function resolveMatchedOptions(): EntitySearchOption[] {
    return listedTypes
      .flatMap((config) => config.search(query))
      .filter(isOfferable);
  }

  // The most recent entities across the listed types, mixed, so the
  // list answers what has been worked on rather than what kinds of
  // thing there are. Each type fetches enough to cover the ones left
  // out, so the list still fills.
  function resolveRecentOptions(): EntitySearchOption[] {
    return listedTypes
      .flatMap((config) => config.getRecent(limit + excludeIds.length))
      .filter(isOfferable)
      .sort(
        (optionA, optionB) =>
          optionB.recency.getTime() - optionA.recency.getTime(),
      )
      .slice(0, limit);
  }

  // Whether the entity is one the consumer does not already hold
  function isOfferable(option: EntitySearchOption): boolean {
    return !excludeIds.includes(option.id);
  }

  return (
    <SearchableMenu
      scrollable={scrollable}
      className={className}
      searchTerm={query}
      onSearchTermChange={setQuery}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
    >
      {options.map((option) => (
        <SearchableMenuItem
          key={option.id}
          stringLabel={option.label}
          contentIcon={option.icon}
          onSelect={() => onSelect(option.id)}
        />
      ))}
    </SearchableMenu>
  );
};
