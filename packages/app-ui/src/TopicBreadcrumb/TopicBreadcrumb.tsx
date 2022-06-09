import React, { FC, useCallback, useState } from 'react';
import { Breadcrumb, Popover, PopoverAnchor } from '@minddrop/ui';
import { useTopic } from '@minddrop/topics';
import { App } from '@minddrop/app';
import { useAppCore } from '@minddrop/app';
import { RenameTopicPopover } from '../RenameTopicPopover';
import { useTranslation } from '@minddrop/i18n';

export interface TopicBreadcrumbProps {
  /**
   * The IDs of the topics leading up to and including the
   * topicrepresented by the breadcrumb.
   */
  trail: string[];

  /**
   * Action fired when the breadcrumb is clicked.
   * - 'open-view' opens the clicked topic's view.
   * - 'open-rename' opens a RenameTopicPopover.
   */
  onClick?: 'open-view' | 'open-rename';
}

export const TopicBreadcrumb: FC<TopicBreadcrumbProps> = ({
  trail,
  onClick,
}) => {
  const topicId = trail.slice(-1)[0];
  const core = useAppCore();
  const topic = useTopic(topicId);
  const { t } = useTranslation();
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);
  const label = topic.title || t('untitled');

  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  function closeRenamePopover() {
    setRenamePopoverOpen(false);
  }

  const handleClick = useCallback(() => {
    if (onClick === 'open-view') {
      App.openTopicView(core, trail);
    }
  }, [onClick]);

  if (onClick === 'open-rename') {
    return (
      <Popover open={renamePopoverOpen}>
        <PopoverAnchor>
          <Breadcrumb label={label} onClick={openRenamePopover} />
        </PopoverAnchor>
        <RenameTopicPopover topic={topic} onClose={closeRenamePopover} />
      </Popover>
    );
  }

  return <Breadcrumb label={label} onClick={handleClick} />;
};
