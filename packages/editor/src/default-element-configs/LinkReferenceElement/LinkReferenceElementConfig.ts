import { LinkReferenceElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { LinkReferenceElementComponent } from './LinkReferenceElementComponent';

export const LinkReferenceElementConfig: EditorBlockElementConfig<LinkReferenceElement> =
  {
    type: 'link-reference',
    component: LinkReferenceElementComponent,
  };
