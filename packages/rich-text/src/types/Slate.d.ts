import { RTNode } from './RTNode.types';
import { RTElement } from './RTElement.types';

declare module 'slate' {
  interface CustomTypes {
    Element: RTElement;
    Text: RTNode;
  }
}
