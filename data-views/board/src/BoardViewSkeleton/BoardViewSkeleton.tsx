import React from 'react';
import './BoardViewSkeleton.css';

/**
 * Renders a skeleton placeholder for the board view type.
 */
export const BoardViewSkeleton: React.FC = () => {
  return (
    <div className="board-view-skeleton">
      <div className="board-view-skeleton-column">
        <div className="board-view-skeleton-card" style={{ height: 180 }} />
        <div className="board-view-skeleton-card" style={{ height: 148 }} />
        <div className="board-view-skeleton-card" style={{ height: 200 }} />
        <div className="board-view-skeleton-card" style={{ height: 164 }} />
      </div>
      <div className="board-view-skeleton-column">
        <div className="board-view-skeleton-card" style={{ height: 160 }} />
        <div className="board-view-skeleton-card" style={{ height: 192 }} />
        <div className="board-view-skeleton-card" style={{ height: 140 }} />
        <div className="board-view-skeleton-card" style={{ height: 176 }} />
        <div className="board-view-skeleton-card" style={{ height: 156 }} />
      </div>
      <div className="board-view-skeleton-column">
        <div className="board-view-skeleton-card" style={{ height: 208 }} />
        <div className="board-view-skeleton-card" style={{ height: 152 }} />
        <div className="board-view-skeleton-card" style={{ height: 172 }} />
        <div className="board-view-skeleton-card" style={{ height: 188 }} />
      </div>
    </div>
  );
};
