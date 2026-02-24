/**
 * Story.tsx
 * Layout primitives for component story files.
 * Place in packages/ui/src/dev/Story.tsx
 */

import React from 'react';
import './Story.css';

export interface StoryProps {
  title: string;
  children: React.ReactNode;
}

export const Story = ({ title, children }: StoryProps) => (
  <div className="story">
    <h1 className="story-title">{title}</h1>
    <div className="story-sections">{children}</div>
  </div>
);

export interface StorySectionProps {
  title: string;
  description?: string;
  /*
   * Renders on a tinted surface to simulate panel/property editor context.
   */
  tinted?: boolean;
  children: React.ReactNode;
}

export const StorySection = ({ title, description, tinted, children }: StorySectionProps) => (
  <section className={['story-section', tinted ? 'story-section-tinted' : ''].filter(Boolean).join(' ')}>
    <div className="story-section-header">
      <h2 className="story-section-title">{title}</h2>
      {description && <p className="story-section-description">{description}</p>}
    </div>
    <div className="story-section-content">{children}</div>
  </section>
);

export interface StoryRowProps {
  /*
   * Optional row label, e.g. the variant name applied to all items in the row.
   */
  label?: string;
  children: React.ReactNode;
}

export const StoryRow = ({ label, children }: StoryRowProps) => (
  <div className="story-row">
    {label && <span className="story-row-label">{label}</span>}
    <div className="story-row-items">{children}</div>
  </div>
);

export interface StoryItemProps {
  /*
   * Label shown below the rendered component.
   */
  label?: string;
  children: React.ReactNode;
}

export const StoryItem = ({ label, children }: StoryItemProps) => (
  <div className="story-item">
    <div className="story-item-preview">{children}</div>
    {label && <span className="story-item-label">{label}</span>}
  </div>
);
