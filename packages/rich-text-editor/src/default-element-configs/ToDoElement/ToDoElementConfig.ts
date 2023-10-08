import { RichTextBlockElementConfig } from '../../types';
import { ToDoElementData } from './ToDoElement.types';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: RichTextBlockElementConfig<ToDoElementData> = {
  type: 'to-do',
  level: 'block',
  initialize: () => ({
    type: 'to-do',
    level: 'block',
    children: [{ text: '' }],
    done: false,
  }),
  component: ToDoElementComponent,
  shortcuts: ['[] '],
  returnBehaviour: () => ({ done: false }),
};
