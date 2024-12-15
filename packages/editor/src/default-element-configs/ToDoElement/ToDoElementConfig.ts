import { Ast, ToDoElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: EditorBlockElementConfig<ToDoElement> = {
  type: 'to-do',
  initialize: () =>
    Ast.generateElement<ToDoElement>('to-do', {
      checked: false,
    }),
  component: ToDoElementComponent,
  shortcuts: ['[] ', '- [ ]'],
  returnBehaviour: () => ({ checked: false }),
};
