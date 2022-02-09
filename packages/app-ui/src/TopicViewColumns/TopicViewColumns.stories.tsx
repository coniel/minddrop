import React from 'react';
import '../test-utils/initialize-stories';
import { TopicViewColumns, TopicViewColumnsProps } from './TopicViewColumns';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { htmlDrop1, textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;
const { tSailingView } = TOPICS_TEST_DATA;

export default {
  title: 'app/TopicViewColumns',
  component: TopicViewColumns,
};

const viewInstance: TopicViewColumnsProps = {
  ...tSailingView,
  view: 'topics:columns',
  columns: [[textDrop1.id, textDrop2.id], [textDrop3.id], [htmlDrop1.id], []],
};

export const Default: React.FC = () => <TopicViewColumns {...viewInstance} />;
