import { UnorderedListItemElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { UnorderedListItemElementComponent } from './UnorderedListItemElementComponent';

export const UnorderedListItemElementConfig: EditorBlockElementConfig<UnorderedListItemElement> =
  {
    type: 'unordered-list-item',
    component: UnorderedListItemElementComponent,
    shortcuts: ['* ', '- '],
    returnBehaviour: 'same-type',
  };
