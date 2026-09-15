import React from 'react';
import './KanbanViewSkeleton.css';

/**
 * Renders a skeleton placeholder for the kanban view type.
 */
export const KanbanViewSkeleton: React.FC = () => {
  return (
    <div className="kanban-view-skeleton">
      <div className="kanban-view-skeleton-column">
        <div className="kanban-view-skeleton-heading" />
        <div className="kanban-view-skeleton-card" style={{ height: 180 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 148 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 200 }} />
      </div>
      <div className="kanban-view-skeleton-column">
        <div className="kanban-view-skeleton-heading" />
        <div className="kanban-view-skeleton-card" style={{ height: 160 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 192 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 140 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 176 }} />
      </div>
      <div className="kanban-view-skeleton-column">
        <div className="kanban-view-skeleton-heading" />
        <div className="kanban-view-skeleton-card" style={{ height: 208 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 152 }} />
        <div className="kanban-view-skeleton-card" style={{ height: 172 }} />
      </div>
    </div>
  );
};
