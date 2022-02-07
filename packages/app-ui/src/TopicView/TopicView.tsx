import React, { FC, useCallback, useMemo, useRef } from 'react';
import { Topic, useTopic } from '@minddrop/topics';
import { App } from '@minddrop/app';
import { InstanceViewProps } from '@minddrop/views';
import {
  Breadcrumbs,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
  Toolbar,
} from '@minddrop/ui';
import { useAppCore } from '@minddrop/app';
import { TopicBreadcrumb } from '../TopicBreadcrumb';
import { useTranslation } from '@minddrop/i18n';
import { generateTopicMenu } from '../menus';
import './TopicView.css';
import { TopicTitle } from '../TopicTitle';

export interface TopicViewBaseProps {
  topicId: string;
}

export type TopicViewProps = InstanceViewProps<TopicViewBaseProps>;

export const TopicView: FC<TopicViewProps> = ({ topicId }) => {
  const titleInput = useRef<HTMLInputElement | null>(null);
  const core = useAppCore();
  const { t } = useTranslation();
  const topic = useTopic(topicId);
  // const breadcrumbs = useMemo(
  //   () => App.getTopicBreadcrumbs(resource.id),
  //   [resource.id],
  // );
  const onAddSubtopic = useCallback((t: Topic, subtopic: Topic) => {
    App.openTopicView(core, subtopic.id);
  }, []);

  const handleClickRename = useCallback(() => {
    setTimeout(() => {
      titleInput.current.select();
    }, 50);
  }, []);

  const dropdownMenu = useMemo(
    () =>
      generateTopicMenu(core, topic, {
        onRename: handleClickRename,
        onAddSubtopic,
      }),
    [core, topic, onAddSubtopic, handleClickRename],
  );

  return (
    <div className="topic-view">
      <Toolbar className="top-toolbar">
        {/* {breadcrumbs.length && (
          <Breadcrumbs>
            {breadcrumbs.map((crumb) => (
              <TopicBreadcrumb
                topicId={crumb.resource.id}
                key={crumb.resource.id}
                onClick={
                  crumb.resource.id === resource.id
                    ? 'open-rename'
                    : 'open-view'
                }
              />
            ))}
          </Breadcrumbs>
        )} */}
      </Toolbar>
      <div className="header">
        <TopicTitle ref={titleInput} topic={topic} />
        <Toolbar className="actions">
          <IconButton icon="add" label="Add content" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconButton icon="more-vertical" label="Topic options" />
            </DropdownMenuTrigger>
            <DropdownMenuContent content={dropdownMenu} />
          </DropdownMenu>
        </Toolbar>
      </div>
      <div
        style={{ height: 500, border: '1px dashed black' }}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log(event.dataTransfer.types);
          console.log(event.dataTransfer.items);
        }}
      ></div>
    </div>
  );
};
