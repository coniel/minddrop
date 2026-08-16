import { LinkElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { LinkElementComponent } from './LinkElementComponent';

export const LinkElementConfig: EditorBlockElementConfig<LinkElement> = {
  type: 'link',
  component: LinkElementComponent,
};
