import { ElementTypeConfig } from '../../types';
import { stringifyToDoElementBatchToMarkdown } from './stringifyToDoElementBatchToMarkdown';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';

export const ToDoElementConfig: ElementTypeConfig = {
  type: 'to-do',
  display: 'block',
  toMarkdown: stringifyToDoElementToMarkdown,
  stringifyBatchToMarkdown: stringifyToDoElementBatchToMarkdown,
};
