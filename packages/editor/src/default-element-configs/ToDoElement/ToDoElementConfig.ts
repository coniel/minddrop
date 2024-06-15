import { Ast, ToDoElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: EditorBlockElementConfig<ToDoElement> = {
  type: 'to-do',
  display: 'block',
  initialize: () =>
    Ast.generateBlockElement<ToDoElement>('to-do', {
      checked: false,
    }),
  component: ToDoElementComponent,
  shortcuts: ['[] ', '- [ ]'],
  returnBehaviour: () => ({ checked: false }),
};
