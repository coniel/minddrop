import { LeafElementSchema, RootElementSchema } from './ElementSchema.types';

export interface ElementTree extends Omit<RootElementSchema, 'children'> {
  children: (LeafElementSchema | ElementTree)[];
}
