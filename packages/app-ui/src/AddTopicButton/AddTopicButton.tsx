import React, { FC } from 'react';
import { SecondaryNavItem } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { App, useAppCore } from '@minddrop/app';

export const AddTopicButton: FC = () => {
  const core = useAppCore();
  const { t } = useTranslation();

  function handleClick() {
    // Create the topic
    const topic = App.createTopic(core);

    // Add the new topic to the root level
    App.addRootTopics(core, [topic.id]);

    // Open the new topic
    App.openTopicView(core, [topic.id]);
  }

  return (
    <SecondaryNavItem
      data-testid="button"
      icon="add"
      label={t('createTopic')}
      onClick={handleClick}
    />
  );
};
