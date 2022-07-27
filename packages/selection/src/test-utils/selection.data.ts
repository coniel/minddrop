import { SelectionItem } from '../types';

export const selectedDrop1: SelectionItem = {
  resource: 'drops:drop',
  id: 'drop-1',
  parent: {
    resource: 'topic:topic',
    id: 'topic-1',
  },
};

export const selectedDrop2: SelectionItem = {
  resource: 'drops:drop',
  id: 'drop-2',
  parent: {
    resource: 'topic:topic',
    id: 'topic-1',
  },
};

export const selectedDrop3: SelectionItem = {
  resource: 'drops:drop',
  id: 'drop-3',
  parent: {
    resource: 'topic:topic',
    id: 'topic-1',
  },
};

export const selectedTopic1: SelectionItem = {
  resource: 'topics:topic',
  id: 'topic-1',
  parent: {
    resource: 'topic:topic',
    id: 'topic-2',
  },
};

export const selectedTopic2: SelectionItem = {
  resource: 'topics:topic',
  id: 'topic-2',
};

export const selectedRichTextElement1: SelectionItem = {
  resource: 'rich-text:element',
  id: 'rich-text-element-1',
  parent: {
    resource: 'rich-text:document',
    id: 'rich-text-document-1',
  },
};
