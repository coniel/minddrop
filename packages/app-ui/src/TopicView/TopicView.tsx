import React, { FC, useRef } from 'react';
import { useTopic } from '@minddrop/topics';
import { InstanceViewProps } from '@minddrop/views';
import { IconButton, Toolbar } from '@minddrop/ui';
import { useAppCore } from '@minddrop/app';
import { TopicTitle } from '../TopicTitle';
import { useLocalPersistentStoreValue } from '@minddrop/persistent-store';
import { TopicBreadcrumbs } from '../TopicBreadcrumbs';
import './TopicView.css';
import { TopicViewOptionsMenu } from '../TopicViewOptionsMenu';

export interface TopicViewBaseProps {
  topic: string;
}

export type TopicViewProps = InstanceViewProps<TopicViewBaseProps>;

export const TopicView: FC<TopicViewProps> = ({ topic: topicId, children }) => {
  const titleInput = useRef<HTMLInputElement | null>(null);
  const core = useAppCore();
  const topic = useTopic(topicId);
  const trail = useLocalPersistentStoreValue(core, 'topicTrail', [topicId]);

  return (
    <div className="topic-view">
      <Toolbar className="top-toolbar">
        <TopicBreadcrumbs trail={trail} />
      </Toolbar>
      <div className="header">
        <TopicTitle ref={titleInput} topic={topic} />
        <Toolbar className="actions">
          <IconButton icon="add" label="Add content" />
          <TopicViewOptionsMenu topic={topic} trail={trail} />
        </Toolbar>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};
