import React, { FC } from 'react';
import { Breadcrumbs } from '@minddrop/ui';
import { TopicBreadcrumb } from '../TopicBreadcrumb';

export interface TopicBreadcrumbsProps {
  /**
   * The trail of topic IDs to render as breadcrumbs.
   */
  trail: string[];
}

export const TopicBreadcrumbs: FC<TopicBreadcrumbsProps> = ({ trail }) => {
  return (
    <Breadcrumbs>
      {trail.map((id, index) => (
        <TopicBreadcrumb
          trail={trail.slice(0, index + 1)}
          key={id}
          onClick={index === trail.length - 1 ? 'open-rename' : 'open-view'}
        />
      ))}
    </Breadcrumbs>
  );
};
