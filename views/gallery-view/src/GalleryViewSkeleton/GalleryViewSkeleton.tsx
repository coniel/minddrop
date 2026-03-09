import React from 'react';
import './GalleryViewSkeleton.css';

/**
 * Renders a skeleton placeholder for the gallery view type.
 */
export const GalleryViewSkeleton: React.FC = () => {
  return (
    <div className="gallery-view-skeleton">
      <div className="gallery-view-skeleton-card" style={{ height: 192 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 148 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 224 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 176 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 200 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 156 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 210 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 168 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 188 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 144 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 216 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 180 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 196 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 160 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 232 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 172 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 204 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 152 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 184 }} />
      <div className="gallery-view-skeleton-card" style={{ height: 220 }} />
    </div>
  );
};
