import { FootnoteReferenceElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { FootnoteReferenceElementComponent } from './FootnoteReferenceElementComponent';

export const FootnoteReferenceElementConfig: EditorBlockElementConfig<FootnoteReferenceElement> =
  {
    type: 'footnote-reference',
    component: FootnoteReferenceElementComponent,
  };
