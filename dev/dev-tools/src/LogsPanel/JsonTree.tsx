import React, { useState } from 'react';
import './JsonTree.css';

interface JsonNodeProps {
  value: unknown;
  keyName?: string;
  depth: number;
  isLast: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({ value, keyName, depth, isLast }) => {
  const [open, setOpen] = useState(depth === 0);

  const comma = !isLast ? <span className="json-comma">,</span> : null;

  if (Array.isArray(value)) {
    const toggle = () => setOpen((o) => !o);
    return (
      <div className="json-node">
        <div className="json-row">
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
              <span className="json-preview">Array({value.length})</span>
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
    return (
      <div className="json-node">
        <div className="json-row">
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
              <span className="json-preview">
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

export const JsonTree: React.FC<{ value: unknown }> = ({ value }) => (
  <div className="json-tree">
    <JsonNode value={value} depth={0} isLast={true} />
  </div>
);
