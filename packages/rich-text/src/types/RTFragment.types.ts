import { RTNode } from './RTNode.types';
import { RTInlineElement } from './RTElement.types';

export type RTFragment = (RTNode | RTInlineElement)[];
