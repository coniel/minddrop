import { Ast, ThematicBreakElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { ThematicBreakElementComponent } from './ThematicBreakElementComponent';

export const ThematicBreakElementConfig: EditorBlockElementConfig<ThematicBreakElement> =
  {
    type: 'thematic-break',
    component: ThematicBreakElementComponent,
    convert: (element, shortcut = '---') =>
      // The break is written back with the character it was typed with
      Ast.generateElement<ThematicBreakElement>('thematic-break', {
        syntax: shortcut,
      }),
    shortcuts: ['---', '***', '___'],
    menuItems: [
      {
        label: 'editor.elements.thematic-break.name',
        keywords: 'editor.elements.thematic-break.keywords',
        icon: 'minus',
      },
    ],
  };
