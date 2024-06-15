import { Ast, HeadingElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: EditorBlockElementConfig<HeadingElement> =
  {
    type: 'heading',
    display: 'block',
    component: HeadingOneElementComponent,
    convert: (element, shortcut = '') =>
      Ast.generateBlockElement<HeadingElement>('heading', {
        children: Ast.isContainerBlock(element)
          ? [{ text: '' }]
          : element.children,
        level: Math.max(1, Math.min(6, shortcut.length - 1)) as 1,
      }),
    shortcuts: ['# ', '## ', '### ', '#### ', '##### ', '###### '],
  };
