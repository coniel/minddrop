import { InlineMathElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { InlineMathElementComponent } from './InlineMathElementComponent';

export const InlineMathElementConfig: EditorBlockElementConfig<InlineMathElement> =
  {
    type: 'inline-math',
    component: InlineMathElementComponent,
    menuItems: [
      {
        label: 'editor.elements.inline-math.name',
        keywords: 'editor.elements.inline-math.keywords',
        icon: 'radical',
      },
    ],
  };
