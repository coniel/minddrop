import React, { useState } from 'react';
import { EventNameTreeNode } from '@minddrop/dev-tools';
import { Icon, MenuGroup, MenuItem } from '@minddrop/ui-primitives';
import './EventNameTree.css';

export interface EventNameTreeProps {
  /**
   * Label of the entry which selects all event names.
   */
  allLabel: string;

  /**
   * How many items fall under all event names.
   */
  allCount: number;

  /**
   * The root nodes of the event name tree.
   */
  nodes: EventNameTreeNode[];

  /**
   * Path of the selected node, or null when all names are selected.
   */
  selectedPath: string | null;

  /**
   * Callback fired when a node is selected.
   */
  onSelect: (path: string | null) => void;
}

/**
 * Renders event names as a tree of their colon separated segments,
 * each selectable to filter by the names below it.
 */
export const EventNameTree: React.FC<EventNameTreeProps> = ({
  allLabel,
  allCount,
  nodes,
  selectedPath,
  onSelect,
}) => {
  const handleSelectAll = () => {
    onSelect(null);
  };

  return (
    <>
      <MenuGroup>
        <MenuItem
          size="compact"
          active={!selectedPath}
          onClick={handleSelectAll}
        >
          <span className="dev-tools-event-name-tree-item">
            {allLabel}
            <span className="dev-tools-event-name-tree-count">{allCount}</span>
          </span>
        </MenuItem>
      </MenuGroup>

      {nodes.map((node) => (
        <MenuGroup key={node.path}>
          <EventNameTreeItem
            node={node}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        </MenuGroup>
      ))}
    </>
  );
};

interface EventNameTreeItemProps {
  /**
   * The node rendered by this item.
   */
  node: EventNameTreeNode;

  /**
   * Path of the selected node.
   */
  selectedPath: string | null;

  /**
   * Callback fired when a node is selected.
   */
  onSelect: (path: string | null) => void;
}

/**
 * Renders a node of the tree, expanding to show its children when
 * it has any.
 */
const EventNameTreeItem: React.FC<EventNameTreeItemProps> = ({
  node,
  selectedPath,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  // Selecting a node filters by it, selecting the already selected
  // node expands or collapses its children instead
  const handleClick = () => {
    if (hasChildren && selectedPath === node.path) {
      setOpen((previous) => !previous);

      return;
    }

    if (hasChildren) {
      setOpen(true);
    }

    onSelect(node.path);
  };

  return (
    <>
      <MenuItem
        size="compact"
        active={selectedPath === node.path}
        onClick={handleClick}
      >
        <span className="dev-tools-event-name-tree-item">
          <span className="dev-tools-event-name-tree-segment">
            {hasChildren && (
              <Icon
                className="dev-tools-event-name-tree-chevron"
                name={open ? 'chevron-down' : 'chevron-right'}
                color="subtle"
              />
            )}
            {node.segment}
          </span>

          <span className="dev-tools-event-name-tree-count">{node.count}</span>
        </span>
      </MenuItem>

      {open && (
        <div className="dev-tools-event-name-tree-children">
          {node.children.map((child) => (
            <EventNameTreeItem
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};
