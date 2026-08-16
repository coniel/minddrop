import { DefinitionElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { DefinitionElementComponent } from './DefinitionElementComponent';

export const DefinitionElementConfig: EditorBlockElementConfig<DefinitionElement> =
  {
    type: 'definition',
    component: DefinitionElementComponent,
  };
