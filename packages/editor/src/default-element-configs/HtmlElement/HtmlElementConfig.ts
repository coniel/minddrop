import { HtmlElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { HtmlElementComponent } from './HtmlElementComponent';

export const HtmlElementConfig: EditorBlockElementConfig<HtmlElement> = {
  type: 'html',
  component: HtmlElementComponent,
};
