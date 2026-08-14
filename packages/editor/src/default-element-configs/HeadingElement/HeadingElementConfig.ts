import { Ast, HeadingElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { HeadingElementComponent } from './HeadingElementComponent';

export const HeadingElementConfig: EditorBlockElementConfig<HeadingElement> = {
  type: 'heading',
  component: HeadingElementComponent,
  convert: (element, shortcut = '') =>
    Ast.generateElement<HeadingElement>('heading', {
      children: element.children,
      level: Math.max(1, Math.min(6, shortcut.length - 1)) as 1,
    }),
  shortcuts: ['# ', '## ', '### ', '#### ', '##### ', '###### '],
  menuItems: [
    {
      label: 'editor.elements.heading-1.name',
      icon: 'heading-1',
      data: { level: 1 },
    },
    {
      label: 'editor.elements.heading-2.name',
      icon: 'heading-2',
      data: { level: 2 },
    },
    {
      label: 'editor.elements.heading-3.name',
      icon: 'heading-3',
      data: { level: 3 },
    },
  ],
};
