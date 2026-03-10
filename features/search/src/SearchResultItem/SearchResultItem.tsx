import React from 'react';
import type { FullTextMatchedProperty } from '@minddrop/search';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '@minddrop/search';
import { ContentIcon } from '@minddrop/ui-primitives';
import './SearchResultItem.css';

export interface SearchResultItemProps {
  /**
   * The content icon string to display (content-icon, emoji,
   * or asset format).
   */
  contentIcon?: string;

  /**
   * The label text displayed next to the icon.
   */
  label: string;

  /**
   * Properties whose values matched the search query.
   */
  matchedProperties?: FullTextMatchedProperty[];

  /**
   * Secondary text displayed on the right side of the
   * label row.
   */
  secondary?: string;

  /**
   * Whether the item is highlighted.
   */
  highlighted?: boolean;

  /**
   * Callback fired when the mouse moves over the item.
   */
  onMouseMove?: () => void;

  /**
   * Callback fired when the item is clicked.
   */
  onClick?: () => void;

  /**
   * Additional content rendered below the label.
   */
  children?: React.ReactNode;
}

/**
 * Renders a search result item with a content icon, label,
 * and matched property values.
 */
export const SearchResultItem = React.forwardRef<
  HTMLDivElement,
  SearchResultItemProps
>(
  (
    {
      contentIcon,
      label,
      matchedProperties,
      secondary,
      highlighted,
      onMouseMove,
      onClick,
      children,
    },
    ref,
  ) => {
    const hasMatchedProperties =
      matchedProperties && matchedProperties.length > 0;

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        className={`search-result-item${highlighted ? ' search-result-item-highlighted' : ''}`}
        onMouseMove={onMouseMove}
        onClick={onClick}
        onKeyDown={handleKeyDown(onClick)}
      >
        {/* Icon and label row */}
        <div className="search-result-item-row">
          {contentIcon && (
            <ContentIcon
              className="search-result-item-icon"
              icon={contentIcon}
            />
          )}

          <span className="search-result-item-label">
            <HighlightedText text={label} />
          </span>

          {secondary && (
            <span className="search-result-item-secondary">{secondary}</span>
          )}
        </div>

        {/* Matched property values */}
        {hasMatchedProperties && (
          <div className="search-result-item-properties">
            {matchedProperties.map((property) => (
              <span key={property.name} className="search-result-item-property">
                <span className="search-result-item-property-name">
                  {property.name}:
                </span>{' '}
                <HighlightedText text={property.value} />
              </span>
            ))}
          </div>
        )}

        {/* Additional content */}
        {children}
      </div>
    );
  },
);

SearchResultItem.displayName = 'SearchResultItem';

/**
 * Returns a keydown handler that triggers the callback on
 * Enter or Space.
 */
function handleKeyDown(
  onClick?: () => void,
): React.KeyboardEventHandler<HTMLDivElement> {
  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };
}

// Regex to split text on highlight markers
const highlightPattern = new RegExp(
  `${MATCH_HIGHLIGHT_START}(.*?)${MATCH_HIGHLIGHT_END}`,
  'g',
);

/**
 * Renders text with search match highlights. Matched substrings
 * between highlight markers are wrapped in <mark> elements.
 */
const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset the regex state before each render
  highlightPattern.lastIndex = 0;

  while ((match = highlightPattern.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Highlighted match
    parts.push(
      <mark key={match.index} className="search-result-item-highlight">
        {match[1]}
      </mark>,
    );

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};
