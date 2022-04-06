import { RichTextBlockElementConfig } from '@minddrop/rich-text';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: RichTextBlockElementConfig = {
  type: 'to-do',
  level: 'block',
  component: ToDoElementComponent,
  shortcuts: ['[]'],
  initializeData: () => ({ done: false }),
};
