import { ExtensionConfig } from '@minddrop/extensions';
import { Topics } from '@minddrop/topics';
import { topicViewColumnsConfig } from '../config';

export const Extension: ExtensionConfig = {
  id: 'minddrop/topic-view-columns',
  name: 'Columns Topic View',
  description: 'A column based layout.',
  scopes: ['topic'],
  onRun: (core) => {
    // Register the topic view
    Topics.registerView(core, topicViewColumnsConfig);
  },
};
