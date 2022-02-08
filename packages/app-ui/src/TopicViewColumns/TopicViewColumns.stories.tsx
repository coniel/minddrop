import React from 'react';
import '../tests/setup-stories';
import {
  htmlDrop1,
  textDrop1,
  textDrop2,
  textDrop3,
} from '../tests/drops.data';
import { tSailingView } from '../tests/topics.data';
import { TopicViewColumns, TopicViewColumnsProps } from './TopicViewColumns';

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
