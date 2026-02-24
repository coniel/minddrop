import React, { useEffect, useRef, useState } from 'react';
import './JsonTree.css';

export interface ForceSignal {
  open: boolean;
  id: number;
}

interface JsonNodeProps {
  value: unknown;
  keyName?: string;
  depth: number;
  isLast: boolean;
  externalForce?: ForceSignal | null;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  value,
  keyName,
  depth,
  isLast,
  externalForce,
}) => {
  const [open, setOpen] = useState(depth === 0);
  const [childForce, setChildForce] = useState<ForceSignal | null>(null);
  const lastAppliedId = useRef<number>(-1);

  // Apply external force (from parent right-click or global collapse) and
  // cascade to all children via childForce.
  useEffect(() => {
    if (!externalForce || externalForce.id === lastAppliedId.current) return;
    lastAppliedId.current = externalForce.id;
    setOpen(externalForce.open);
    setChildForce(externalForce);
  }, [externalForce]);

  const comma = !isLast ? <span className="json-comma">,</span> : null;

  if (Array.isArray(value)) {
    const toggle = () => setOpen((o) => !o);
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newOpen = !open;
      setOpen(newOpen);
      setChildForce({ open: newOpen, id: Date.now() });
    };

    return (
      <div className="json-node">
        <div className="json-row" onContextMenu={handleContextMenu}>
          <button className="json-toggle" onClick={toggle}>
            {open ? '▾' : '▸'}
          </button>
          {keyName !== undefined && (
            <span className="json-key json-key-toggle" onClick={toggle}>
              {keyName}:&nbsp;
            </span>
          )}
          {open ? (
            <span className="json-bracket">[</span>
          ) : (
            <>
              <span className="json-preview json-preview-toggle" onClick={toggle}>
                Array({value.length})
              </span>
              {comma}
            </>
          )}
        </div>
        {open && (
          <>
            <div className="json-children">
              {value.map((item, i) => (
                <JsonNode
                  key={i}
                  value={item}
                  depth={depth + 1}
                  isLast={i === value.length - 1}
                  externalForce={childForce}
                />
              ))}
            </div>
            <div className="json-row">
              <span className="json-bracket">]</span>
              {comma}
            </div>
          </>
        )}
      </div>
    );
  }

  if (value instanceof Date) {
    return (
      <div className="json-row">
        {keyName !== undefined && (
          <span className="json-key">{keyName}:&nbsp;</span>
        )}
        <span className="json-date">{value.toLocaleString()}</span>
        {comma}
      </div>
    );
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const toggle = () => setOpen((o) => !o);
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newOpen = !open;
      setOpen(newOpen);
      setChildForce({ open: newOpen, id: Date.now() });
    };

    return (
      <div className="json-node">
        <div className="json-row" onContextMenu={handleContextMenu}>
          <button className="json-toggle" onClick={toggle}>
            {open ? '▾' : '▸'}
          </button>
          {keyName !== undefined && (
            <span className="json-key json-key-toggle" onClick={toggle}>
              {keyName}:&nbsp;
            </span>
          )}
          {open ? (
            <span className="json-bracket">{'{'}</span>
          ) : (
            <>
              <span className="json-preview json-preview-toggle" onClick={toggle}>
                {'{'}
                {entries.length} {entries.length === 1 ? 'key' : 'keys'}
                {'}'}
              </span>
              {comma}
            </>
          )}
        </div>
        {open && (
          <>
            <div className="json-children">
              {entries.map(([k, v], i) => (
                <JsonNode
                  key={k}
                  value={v}
                  keyName={k}
                  depth={depth + 1}
                  isLast={i === entries.length - 1}
                  externalForce={childForce}
                />
              ))}
            </div>
            <div className="json-row">
              <span className="json-bracket">{'}'}</span>
              {comma}
            </div>
          </>
        )}
      </div>
    );
  }

  let valueEl: React.ReactNode;
  if (value === null) {
    valueEl = <span className="json-null">null</span>;
  } else if (value === undefined) {
    valueEl = <span className="json-undefined">undefined</span>;
  } else if (value === true) {
    valueEl = <span className="json-bool-true">true</span>;
  } else if (value === false) {
    valueEl = <span className="json-bool-false">false</span>;
  } else if (typeof value === 'number') {
    valueEl = <span className="json-number">{value}</span>;
  } else if (typeof value === 'string') {
    valueEl = <span className="json-string">"{value}"</span>;
  } else {
    valueEl = <span>{String(value)}</span>;
  }

  return (
    <div className="json-row">
      {keyName !== undefined && (
        <span className="json-key">{keyName}:&nbsp;</span>
      )}
      {valueEl}
      {comma}
    </div>
  );
};

export const JsonTree: React.FC<{
  value: unknown;
  externalForce?: ForceSignal | null;
}> = ({ value, externalForce }) => (
  <div className="json-tree">
    <JsonNode
      value={value}
      depth={0}
      isLast={true}
      externalForce={externalForce}
    />
  </div>
);
