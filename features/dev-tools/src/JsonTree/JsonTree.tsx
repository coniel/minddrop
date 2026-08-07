import React, { useState } from 'react';
import { Icon } from '@minddrop/ui-primitives';
import './JsonTree.css';

export interface JsonTreeProps {
  /**
   * The value to render.
   */
  value: unknown;
}

/**
 * Renders a value as an expandable tree, with objects and arrays
 * collapsed to a summary until they are opened.
 */
export const JsonTree: React.FC<JsonTreeProps> = ({ value }) => (
  <div className="dev-tools-json-tree">
    <JsonTreeNode value={value} depth={0} isLast />
  </div>
);

interface JsonTreeNodeProps {
  /**
   * The value rendered by this node.
   */
  value: unknown;

  /**
   * Key the value is stored under in its parent object.
   */
  keyName?: string;

  /**
   * How deep the node sits in the tree. The root node is
   * expanded by default.
   */
  depth: number;

  /**
   * Whether the node is the last entry of its parent, which
   * decides if it is followed by a comma.
   */
  isLast: boolean;
}

/**
 * Renders a single value of the tree, branching on its type.
 */
const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  value,
  keyName,
  depth,
  isLast,
}) => {
  // Arrays render as an expandable branch of indexed entries
  if (Array.isArray(value)) {
    return (
      <JsonTreeBranch
        entries={value.map((item, index) => [String(index), item])}
        preview={`Array(${value.length})`}
        brackets={['[', ']']}
        keyName={keyName}
        depth={depth}
        isLast={isLast}
      />
    );
  }

  // Dates render as their formatted value rather than an empty object
  if (value instanceof Date) {
    return (
      <JsonTreeRow keyName={keyName} isLast={isLast}>
        <span className="dev-tools-json-date">{value.toLocaleString()}</span>
      </JsonTreeRow>
    );
  }

  // Remaining objects render as an expandable branch of their entries
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);

    return (
      <JsonTreeBranch
        entries={entries}
        preview={`{${entries.length}}`}
        brackets={['{', '}']}
        keyName={keyName}
        depth={depth}
        isLast={isLast}
      />
    );
  }

  return (
    <JsonTreeRow keyName={keyName} isLast={isLast}>
      <span className={getValueClassName(value)}>{formatValue(value)}</span>
    </JsonTreeRow>
  );
};

interface JsonTreeBranchProps {
  /**
   * The branch's child values, keyed by property name or index.
   */
  entries: [key: string, value: unknown][];

  /**
   * Summary shown in place of the children while collapsed.
   */
  preview: string;

  /**
   * Brackets wrapping the children while expanded.
   */
  brackets: [open: string, close: string];

  /**
   * Key the branch is stored under in its parent object.
   */
  keyName?: string;

  /**
   * How deep the branch sits in the tree.
   */
  depth: number;

  /**
   * Whether the branch is the last entry of its parent.
   */
  isLast: boolean;
}

/**
 * Renders an object or array as a row which expands to show
 * its children.
 */
const JsonTreeBranch: React.FC<JsonTreeBranchProps> = ({
  entries,
  preview,
  brackets,
  keyName,
  depth,
  isLast,
}) => {
  const [open, setOpen] = useState(depth === 0);
  const [openBracket, closeBracket] = brackets;

  const handleToggle = () => {
    setOpen((previous) => !previous);
  };

  return (
    <div className="dev-tools-json-node">
      <div className="dev-tools-json-row">
        <button className="dev-tools-json-toggle" onClick={handleToggle}>
          <Icon name={open ? 'chevron-down' : 'chevron-right'} color="subtle" />
        </button>

        {keyName !== undefined && (
          <span className="dev-tools-json-key" onClick={handleToggle}>
            {keyName}:{' '}
          </span>
        )}

        {open && <span className="dev-tools-json-bracket">{openBracket}</span>}

        {!open && (
          <span className="dev-tools-json-preview" onClick={handleToggle}>
            {preview}
            {!isLast && ','}
          </span>
        )}
      </div>

      {open && (
        <>
          <div className="dev-tools-json-children">
            {entries.map(([key, item], index) => (
              <JsonTreeNode
                key={key}
                keyName={key}
                value={item}
                depth={depth + 1}
                isLast={index === entries.length - 1}
              />
            ))}
          </div>

          <div className="dev-tools-json-row">
            <span className="dev-tools-json-bracket">{closeBracket}</span>
            {!isLast && ','}
          </div>
        </>
      )}
    </div>
  );
};

interface JsonTreeRowProps {
  /**
   * Key the value is stored under in its parent object.
   */
  keyName?: string;

  /**
   * Whether the value is the last entry of its parent.
   */
  isLast: boolean;

  /**
   * The rendered value.
   */
  children: React.ReactNode;
}

/**
 * Renders a leaf value alongside its key.
 */
const JsonTreeRow: React.FC<JsonTreeRowProps> = ({
  keyName,
  isLast,
  children,
}) => (
  <div className="dev-tools-json-row">
    {keyName !== undefined && (
      <span className="dev-tools-json-key">{keyName}: </span>
    )}
    {children}
    {!isLast && ','}
  </div>
);

/**
 * Returns the class name colouring a leaf value by its type.
 */
function getValueClassName(value: unknown): string {
  if (value === null || value === undefined) {
    return 'dev-tools-json-nullish';
  }

  if (typeof value === 'boolean') {
    return 'dev-tools-json-boolean';
  }

  if (typeof value === 'number') {
    return 'dev-tools-json-number';
  }

  if (typeof value === 'string') {
    return 'dev-tools-json-string';
  }

  return 'dev-tools-json-other';
}

/**
 * Returns the text of a leaf value, quoting strings so they are
 * distinguishable from the values around them.
 */
function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return String(value);
}
