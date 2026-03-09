import React from 'react';
import './NotebookViewSkeleton.css';

const LIST_ITEMS = [
  { titleWidth: '72%', subtitleWidth: '50%' },
  { titleWidth: '58%', subtitleWidth: '65%' },
  { titleWidth: '85%', subtitleWidth: '40%' },
  { titleWidth: '45%', subtitleWidth: '70%' },
  { titleWidth: '68%', subtitleWidth: '55%' },
  { titleWidth: '52%', subtitleWidth: '48%' },
  { titleWidth: '78%', subtitleWidth: '60%' },
  { titleWidth: '62%', subtitleWidth: '35%' },
  { titleWidth: '40%', subtitleWidth: '72%' },
  { titleWidth: '75%', subtitleWidth: '45%' },
  { titleWidth: '65%', subtitleWidth: '58%' },
  { titleWidth: '48%', subtitleWidth: '42%' },
  { titleWidth: '80%', subtitleWidth: '68%' },
  { titleWidth: '55%', subtitleWidth: '52%' },
  { titleWidth: '70%', subtitleWidth: '38%' },
  { titleWidth: '42%', subtitleWidth: '75%' },
  { titleWidth: '82%', subtitleWidth: '55%' },
  { titleWidth: '60%', subtitleWidth: '62%' },
  { titleWidth: '50%', subtitleWidth: '45%' },
  { titleWidth: '76%', subtitleWidth: '58%' },
];

type PageBlock =
  | { type: 'heading'; width: string }
  | { type: 'line'; width: string }
  | { type: 'gap' };

const PAGE_BLOCKS: PageBlock[] = [
  // Intro paragraph
  { type: 'line', width: '98%' },
  { type: 'line', width: '95%' },
  { type: 'line', width: '97%' },
  { type: 'line', width: '45%' },

  // First subheading
  { type: 'heading', width: '35%' },

  { type: 'line', width: '96%' },
  { type: 'line', width: '99%' },
  { type: 'line', width: '94%' },
  { type: 'line', width: '97%' },
  { type: 'line', width: '38%' },

  { type: 'gap' },

  { type: 'line', width: '97%' },
  { type: 'line', width: '95%' },
  { type: 'line', width: '98%' },
  { type: 'line', width: '52%' },

  // Second subheading
  { type: 'heading', width: '28%' },

  { type: 'line', width: '95%' },
  { type: 'line', width: '98%' },
  { type: 'line', width: '96%' },
  { type: 'line', width: '60%' },

  { type: 'gap' },

  { type: 'line', width: '99%' },
  { type: 'line', width: '94%' },
  { type: 'line', width: '97%' },
  { type: 'line', width: '96%' },
  { type: 'line', width: '42%' },

  { type: 'gap' },

  { type: 'line', width: '96%' },
  { type: 'line', width: '98%' },
  { type: 'line', width: '35%' },
];

/**
 * Renders a skeleton placeholder for the notebook view type.
 */
export const NotebookViewSkeleton: React.FC = () => {
  return (
    <div className="notebook-view-skeleton">
      {/* List panel */}
      <div className="notebook-view-skeleton-list">
        {/* Toolbar skeleton */}
        <div className="notebook-view-skeleton-toolbar">
          <div className="notebook-view-skeleton-search" />
          <div className="notebook-view-skeleton-button" />
        </div>

        {/* List items */}
        {LIST_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`notebook-view-skeleton-list-item${index === 0 ? ' notebook-view-skeleton-list-item-selected' : ''}`}
          >
            <div
              className="notebook-view-skeleton-list-item-title"
              style={{ width: item.titleWidth }}
            />
            <div
              className="notebook-view-skeleton-list-item-subtitle"
              style={{ width: item.subtitleWidth }}
            />
          </div>
        ))}
      </div>

      {/* Page panel */}
      <div className="notebook-view-skeleton-page">
        {/* Page title */}
        <div className="notebook-view-skeleton-page-title" />

        {/* Page content */}
        {PAGE_BLOCKS.map((block, index) => {
          if (block.type === 'gap') {
            return <div key={index} className="notebook-view-skeleton-page-gap" />;
          }

          return (
            <div
              key={index}
              className={
                block.type === 'heading'
                  ? 'notebook-view-skeleton-page-heading'
                  : 'notebook-view-skeleton-page-line'
              }
              style={{ width: block.width }}
            />
          );
        })}
      </div>
    </div>
  );
};
