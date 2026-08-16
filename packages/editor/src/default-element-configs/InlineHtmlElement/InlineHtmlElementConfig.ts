import { InlineHtmlElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { InlineHtmlElementComponent } from './InlineHtmlElementComponent';

export const InlineHtmlElementConfig: EditorBlockElementConfig<InlineHtmlElement> =
  {
    type: 'inline-html',
    component: InlineHtmlElementComponent,
  };
