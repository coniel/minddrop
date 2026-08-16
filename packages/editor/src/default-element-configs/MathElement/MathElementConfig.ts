import { Ast, MathElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { MathElementComponent } from './MathElementComponent';

export const MathElementConfig: EditorBlockElementConfig<MathElement> = {
  type: 'math',
  component: MathElementComponent,
  // A math block holds its own lines, so return stays inside it
  returnBehaviour: 'line-break',
  convert: (element) =>
    Ast.generateElement<MathElement>('math', {
      children: [{ text: Ast.toPlainText([element]) }],
    }),
  shortcuts: ['$$'],
  menuItems: [
    {
      label: 'editor.elements.math.name',
      keywords: 'editor.elements.math.keywords',
      icon: 'sigma',
    },
  ],
};
