import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  TopicDrop as TopicDropPrimitive,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  Popover,
  PopoverAnchor,
} from '@minddrop/ui';
import { useTopic } from '@minddrop/topics';
import { App, useAppCore } from '@minddrop/app';
import { TopicMenu } from '../TopicMenu';
import { RenameTopicPopover } from '../RenameTopicPopover';

export interface TopicDropProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The trail of topic IDs leading up to
   * and including this one.
   */
  trail: string[];
}

export const TopicDrop: FC<TopicDropProps> = ({ trail }) => {
  const core = useAppCore();
  // The topic ID is the last ID in the trail
  const topicId = useMemo(() => trail.slice(-1)[0], [trail]);
  // Get the topic
  const topic = useTopic(topicId);
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  const openTopicView = useCallback(() => {
    App.openTopicView(core, trail);
  }, [core, trail]);

  const openRenamePopover = useCallback(() => {
    setRenamePopoverOpen(true);
  }, []);

  const closeRenamePopover = useCallback(() => {
    setRenamePopoverOpen(false);
  }, []);

  return (
    <Popover open={renamePopoverOpen} onOpenChange={null}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <PopoverAnchor asChild>
            <TopicDropPrimitive label={topic.title} onClick={openTopicView} />
          </PopoverAnchor>
        </ContextMenuTrigger>
        <ContextMenuContent className="topic-menu-content">
          <TopicMenu
            menuType="context"
            trail={trail}
            onRename={openRenamePopover}
          />
        </ContextMenuContent>
      </ContextMenu>
      <RenameTopicPopover topic={topic} onClose={closeRenamePopover} />
    </Popover>
  );
};
