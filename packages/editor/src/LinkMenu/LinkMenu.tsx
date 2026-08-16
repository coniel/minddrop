import React, { useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  SearchableMenu,
  SearchableMenuItem,
} from '@minddrop/ui-primitives';
import { isUrl } from '@minddrop/utils';
import { EditorReference } from '../types';
import { RangeAnchor } from '../utils';
import './LinkMenu.css';

export interface LinkMenuProps {
  /**
   * The position of the text the link is being made from, or null when the
   * menu is closed.
   */
  anchor: RangeAnchor | null;

  /**
   * The text typed into the menu's field.
   */
  query: string;

  /**
   * The references offered for the current query.
   */
  references: EditorReference[];

  /**
   * Callback fired when the query changes.
   */
  onQueryChange: (query: string) => void;

  /**
   * Callback fired when a reference is chosen.
   */
  onSelectReference: (reference: EditorReference) => void;

  /**
   * Callback fired when a web address is chosen.
   */
  onSelectUrl: (url: string) => void;

  /**
   * Callback fired when the menu is dismissed.
   */
  onClose: () => void;
}

/**
 * Renders the menu for making a link, positioned below the text the link is
 * being made from.
 *
 * A query which is a web address offers that address; anything else searches
 * the references, which are listed as they are until something is typed.
 */
export const LinkMenu: React.FC<LinkMenuProps> = ({
  anchor,
  query,
  references,
  onQueryChange,
  onSelectReference,
  onSelectUrl,
  onClose,
}) => {
  const { t } = useTranslation({ keyPrefix: 'editor.linkMenu' });

  // Positioned against the text rather than against a trigger element, of
  // which the menu has none
  const positionerAnchor = useMemo(
    () => (anchor ? { getBoundingClientRect: () => anchor.rect } : undefined),
    [anchor],
  );

  // A query which is a web address is offered as one, rather than searched
  // for among the references
  const url = isUrl(query) ? query : null;

  return (
    <Popover open={!!anchor} onOpenChange={onClose} modal={false}>
      <PopoverPortal>
        <PopoverPositioner
          anchor={positionerAnchor}
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <PopoverContent className="link-menu" finalFocus={false}>
            {/* The search term is owned here, the references being searched
                for rather than the listed items filtered */}
            <SearchableMenu
              searchTerm={query}
              onSearchTermChange={onQueryChange}
              searchPlaceholder="editor.linkMenu.placeholder"
              emptyText={t('noResults')}
              scrollable
            >
              {url ? (
                <SearchableMenuItem
                  icon="globe"
                  stringLabel={url}
                  description="editor.linkMenu.webpage"
                  onSelect={() => onSelectUrl(url)}
                />
              ) : (
                references.map((reference) => (
                  <SearchableMenuItem
                    key={reference.reference}
                    icon={reference.icon}
                    stringLabel={reference.label}
                    stringDescription={reference.description}
                    onSelect={() => onSelectReference(reference)}
                  />
                ))
              )}
            </SearchableMenu>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
