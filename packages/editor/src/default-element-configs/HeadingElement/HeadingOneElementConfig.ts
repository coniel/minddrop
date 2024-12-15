import { Ast, HeadingElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: EditorBlockElementConfig<HeadingElement> =
  {
    type: 'heading',
    component: HeadingOneElementComponent,
    convert: (element, shortcut = '') =>
      Ast.generateElement<HeadingElement>('heading', {
        children: element.children,
        level: Math.max(1, Math.min(6, shortcut.length - 1)) as 1,
      }),
    shortcuts: ['# ', '## ', '### ', '#### ', '##### ', '###### '],
  };
