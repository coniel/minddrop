import {
  ContainerElementSchema,
  LeafElementSchema,
  RootElementSchema,
} from './ElementSchema.types';

export interface ContainerElementTree
  extends Omit<ContainerElementSchema, 'children'> {
  children: (LeafElementSchema | ContainerElementTree)[];
}

export interface RootElementTree extends Omit<RootElementSchema, 'children'> {
  children: (LeafElementSchema | ContainerElementTree)[];
}
