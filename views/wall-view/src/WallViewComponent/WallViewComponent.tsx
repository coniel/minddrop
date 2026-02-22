import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { DatabaseEntryRenderer } from '@minddrop/feature-database-entries';
import { ViewTypeComponentProps } from '@minddrop/views';
import { defaultWallViewOptions } from '../constants';
import { WallViewOptions } from '../types';
import './WallViewComponent.css';

interface Column {
  id: string;
  entries: string[];
}

export const WallViewComponent: React.FC<
  ViewTypeComponentProps<WallViewOptions>
> = ({ view, entries }) => {
  const maxColumns = useMemo(
    () => view.options?.maxColumns || defaultWallViewOptions.maxColumns,
    [view.options],
  );
  const minColumnWidth = useMemo(
    () => view.options?.minColumnWidth || defaultWallViewOptions.minColumnWidth,
    [view.options],
  );
  const ref = useRef<HTMLDivElement>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const columnCount = useMemo(
    () => calculateColumnCount(maxColumns, viewWidth, minColumnWidth),
    [maxColumns, viewWidth, minColumnWidth],
  );
  const columns = useMemo(
    () => splitIntoColumns(entries, columnCount),
    [entries, columnCount],
  );

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="wall-view">
      {columns.map((column) => (
        <Column key={column.id} id={column.id} entries={column.entries} />
      ))}
    </div>
  );
};

const Column = React.memo(
  ({ id, entries }: Column) => {
    return (
      <div className="column" key={id}>
        {entries.map((entry) => (
          <DatabaseEntryRenderer
            key={entry}
            entryId={entry}
            designType="card"
          />
        ))}
      </div>
    );
  },
  (prev, next) =>
    prev.id === next.id && prev.entries.length === next.entries.length,
);

Column.displayName = 'Column';

function calculateColumnCount(
  maxColumns: number,
  viewWidth: number,
  minColumnWidth: number,
) {
  return Math.max(
    1,
    Math.min(maxColumns, Math.floor(viewWidth / minColumnWidth)),
  );
}

function splitIntoColumns(entries: string[], columnCount: number): Column[] {
  const columns: Column[] = Array.from({ length: columnCount }, (_, i) => ({
    id: `col-${entries[0]}-${entries[entries.length - 1]}-${i}`,
    entries: [],
  }));

  entries.forEach((entry, index) => {
    columns[index % columnCount].entries.push(entry);
  });

  return columns;
}
