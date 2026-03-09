import React from 'react';
import './TableViewSkeleton.css';

const SKELETON_COLUMNS = [
  { width: '35%', type: 'text' },
  { width: '25%', type: 'text' },
  { width: '100px', type: 'number' },
  { width: '25%', type: 'text' },
];

const SKELETON_ROWS = [
  ['72%', '45%', '28px', '60%'],
  ['58%', '80%', '36px', '42%'],
  ['85%', '35%', '20px', '70%'],
  ['40%', '62%', '32px', '55%'],
  ['68%', '48%', '24px', '82%'],
  ['52%', '70%', '40px', '38%'],
  ['76%', '42%', '28px', '65%'],
  ['64%', '55%', '32px', '48%'],
  ['80%', '38%', '24px', '72%'],
  ['45%', '72%', '36px', '58%'],
  ['70%', '50%', '20px', '65%'],
  ['55%', '65%', '28px', '40%'],
  ['82%', '42%', '40px', '75%'],
  ['48%', '78%', '24px', '52%'],
  ['75%', '58%', '32px', '68%'],
  ['62%', '40%', '36px', '80%'],
  ['38%', '85%', '28px', '45%'],
  ['78%', '52%', '20px', '62%'],
  ['50%', '68%', '40px', '35%'],
  ['65%', '45%', '24px', '78%'],
  ['42%', '75%', '32px', '58%'],
  ['74%', '60%', '36px', '50%'],
  ['56%', '82%', '20px', '68%'],
  ['88%', '48%', '28px', '42%'],
  ['46%', '58%', '40px', '76%'],
  ['72%', '40%', '24px', '62%'],
  ['60%', '72%', '32px', '55%'],
  ['84%', '52%', '28px', '70%'],
];

/**
 * Renders a skeleton placeholder for the table view type.
 */
export const TableViewSkeleton: React.FC = () => {
  return (
    <div className="table-view-skeleton">
      {/* Header */}
      <div className="table-view-skeleton-header">
        <div className="table-view-skeleton-row-number" />
        {SKELETON_COLUMNS.map((column, index) => (
          <div
            key={index}
            className="table-view-skeleton-header-cell"
            style={{
              flex: column.width.endsWith('%')
                ? column.width
                : `0 0 ${column.width}`,
            }}
          >
            <div className="table-view-skeleton-header-icon" />
            <div className="table-view-skeleton-header-label" />
          </div>
        ))}
      </div>

      {/* Body rows */}
      {SKELETON_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="table-view-skeleton-row">
          <div className="table-view-skeleton-row-number" />
          {row.map((cellWidth, cellIndex) => {
            const isNumber = SKELETON_COLUMNS[cellIndex].type === 'number';

            return (
              <div
                key={cellIndex}
                className={`table-view-skeleton-cell${isNumber ? ' table-view-skeleton-cell-number' : ''}`}
                style={{
                  flex: SKELETON_COLUMNS[cellIndex].width.endsWith('%')
                    ? SKELETON_COLUMNS[cellIndex].width
                    : `0 0 ${SKELETON_COLUMNS[cellIndex].width}`,
                }}
              >
                <div
                  className="table-view-skeleton-cell-value"
                  style={{ width: cellWidth }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
