import { ElementTypeConfig } from '../../types';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';
import { stringifyToDoElementBatchToMarkdown } from './stringifyToDoElementBatchToMarkdown';

export const ToDoElementConfig: ElementTypeConfig = {
  type: 'to-do',
  display: 'block',
  toMarkdown: stringifyToDoElementToMarkdown,
  stringifyBatchToMarkdown: stringifyToDoElementBatchToMarkdown,
};
