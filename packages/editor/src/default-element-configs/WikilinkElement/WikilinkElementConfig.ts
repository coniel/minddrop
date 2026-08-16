import { WikilinkElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { WikilinkElementComponent } from './WikilinkElementComponent';

export const WikilinkElementConfig: EditorBlockElementConfig<WikilinkElement> =
  {
    type: 'wikilink',
    component: WikilinkElementComponent,
  };
