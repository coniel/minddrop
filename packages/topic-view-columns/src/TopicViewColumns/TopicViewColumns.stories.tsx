import React, { useEffect } from 'react';
import { useViewInstance, Views } from '@minddrop/views';
import '../test-utils/initialize-stories';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsInstance } from '../types';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';
import {
  createDataInsertFromDataTransfer,
  mapById,
  setDataTransferData,
} from '@minddrop/utils';
import { core } from '../test-utils/initialize-stories';
import { App } from '@minddrop/app';
import { DropMap, Drops } from '@minddrop/drops';
import { Topics, TopicViewConfig, TopicViewInstance } from '@minddrop/topics';

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

export const Default: React.FC = () => {
  const viewInstance = useViewInstance<TopicViewColumnsInstance>(
    topicViewColumnsInstance.id,
  );

  useEffect(() => {
    Drops.addEventListener(core, 'drops:delete', (payload) => {
      const drop = payload.data;
      console.log(Topics.getAll());
      const topic = Topics.get(viewInstance.topic);

      topic.views.forEach((viewId) => {
        const instance = Views.getInstance<TopicViewInstance>(viewId);
        const view = Topics.getView(instance.view);

        view.onRemoveDrops(core, instance, { [drop.id]: drop });
      });
    });
  }, []);

  return <TopicViewColumns {...viewInstance} />;
};
