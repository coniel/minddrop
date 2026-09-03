import React from 'react';
import { Chip, Group, Text } from '@minddrop/ui-primitives';
import { KanbanColumn } from '../types';
import { resolveLaneStyle } from '../utils';
import './KanbanViewColumnHeading.css';

export interface KanbanViewColumnHeadingProps {
  /**
   * The column the heading names.
   */
  column: KanbanColumn;
}

/**
 * Renders a kanban column's heading: the select option it groups
 * entries by, and how many of them it holds. Sits in the board's
 * heading row, above the column it names.
 */
export const KanbanViewColumnHeading: React.FC<
  KanbanViewColumnHeadingProps
> = ({ column }) => (
  <Group
    gap={2}
    className="kanban-view-heading"
    style={resolveLaneStyle(column.color)}
  >
    <Chip color={column.color}>{column.label}</Chip>
    <Text size="xs" color="subtle">
      {column.entryIds.length}
    </Text>
  </Group>
);
