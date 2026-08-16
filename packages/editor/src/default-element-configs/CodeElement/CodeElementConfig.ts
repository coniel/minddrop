import { Ast, CodeElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { CodeElementComponent } from './CodeElementComponent';

export const CodeElementConfig: EditorBlockElementConfig<CodeElement> = {
  type: 'code',
  component: CodeElementComponent,
  // A code block holds its own lines, so return stays inside it
  returnBehaviour: 'line-break',
  convert: (element, shortcut = '```') =>
    Ast.generateElement<CodeElement>('code', {
      children: [{ text: Ast.toPlainText([element]) }],
      // The fence is written back the way it was typed
      fence: shortcut.startsWith('~') ? '~' : '`',
      fenceLength: shortcut.length,
    }),
  shortcuts: ['```', '~~~'],
  menuItems: [
    {
      label: 'editor.elements.code.name',
      keywords: 'editor.elements.code.keywords',
      icon: 'code',
    },
  ],
};
