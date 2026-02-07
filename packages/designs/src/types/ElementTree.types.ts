import {
  ContainerElementSchema,
  LeafElementSchema,
} from './ElementSchema.types';

export interface ElementTree extends Omit<ContainerElementSchema, 'children'> {
  children: (LeafElementSchema | ElementTree)[];
}
