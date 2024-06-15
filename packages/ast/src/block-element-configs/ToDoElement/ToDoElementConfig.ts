import { BlockElementConfig } from '../../types';
import { parseToDoElementFromMarkdown } from './parseToDoElementFromMarkdown';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';
import { stringifyToDoElementBatchToMarkdown } from './stringifyToDoElementBatchToMarkdown';

export const ToDoElementConfig: BlockElementConfig = {
  type: 'to-do',
  fromMarkdown: parseToDoElementFromMarkdown,
  toMarkdown: stringifyToDoElementToMarkdown,
  stringifyBatchToMarkdown: stringifyToDoElementBatchToMarkdown,
};
