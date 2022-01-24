import React, { FC } from 'react';
import { SecondaryNavItem } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { Core } from '@minddrop/core';
import { App } from '@minddrop/app';
import { Topics } from '@minddrop/topics';

export interface AddTopicButtonProps {
  core: Core;
}

export const AddTopicButton: FC<AddTopicButtonProps> = ({ core }) => {
  const { t } = useTranslation();

  function handleClick() {
    // Create the topic
    const topic = Topics.create(core);

    // Add the new topic to the root level
    App.addTopics(core, [topic.id]);
  }

  return (
    <SecondaryNavItem
      data-testid="button"
      label={t('createTopic')}
      onClick={handleClick}
    />
  );
};
