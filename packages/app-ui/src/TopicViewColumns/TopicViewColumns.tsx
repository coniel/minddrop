/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react';
import './TopicViewColumns.css';
import { TopicViewInstance, useAppCore } from '@minddrop/app';
import { useTopic } from '@minddrop/topics';
import { Drops, useDrops } from '@minddrop/drops';

export interface TopicViewColumnsProps extends TopicViewInstance {
  /**
   * An array of string arrays, each one representing a column
   * containing the IDs of the drops in that column.
   */
  columns: string[][];
}

export const TopicViewColumns: FC<TopicViewColumnsProps> = ({
  topicId,
  columns,
}) => {
  const core = useAppCore();
  const topic = useTopic(topicId);
  const drops = useDrops(topic.drops);

  return (
    <div className="topic-view-columns">
      {columns.map((column, index) => (
        <div key={index} className="column">
          {column.map((dropId) => Drops.render(drops[dropId]))}
        </div>
      ))}
    </div>
  );
};
