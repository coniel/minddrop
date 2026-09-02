import React from 'react';
import { Tags } from '@minddrop/tags';
import { Chip, ContentIcon, Icon } from '@minddrop/ui-primitives';
import { TableColumn } from '../types';
import './TagsCell.css';

interface TagsDisplayProps {
  /**
   * The entry's tag names.
   */
  value: string[];

  /**
   * The column configuration including display settings.
   */
  column: TableColumn;
}

/**
 * Renders the inactive display state of a tags cell: the entry's
 * tags as chips colored by the tag's color. Unknown names degrade
 * to default color chips.
 */
export const TagsDisplay: React.FC<TagsDisplayProps> = React.memo(
  ({ value, column }) => {
    // Subscribe to tag changes so colors and icons stay fresh
    const tags = Tags.useAll();

    // Render as plain text when showChips is disabled
    const showChips = column.showChips !== false;

    // Render tag icons inside the chips unless disabled
    const showChipIcons = column.showChipIcons !== false;

    return (
      <div className="tags-cell">
        {showChips ? (
          value.map((name) => {
            // The chip's tag, used for its color and icon
            const tag = tags.find((candidate) => candidate.name === name);

            return (
              <Chip key={name} size="sm" color={tag?.color || 'default'}>
                {showChipIcons && tag && (
                  <ContentIcon
                    icon={tag.icon}
                    className="tags-cell-chip-icon"
                  />
                )}
                {name}
              </Chip>
            );
          })
        ) : value.length ? (
          <span className="tags-cell-text">{value.join(', ')}</span>
        ) : null}
        <Icon name="chevron-down" className="tags-cell-chevron" />
      </div>
    );
  },
);

TagsDisplay.displayName = 'TagsDisplay';
