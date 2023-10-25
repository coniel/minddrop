import type * as mdast from 'mdast';

export type {
  RootContent,
  PhrasingContent,
  ListItem as MdastListItem,
} from 'mdast';

export type MdastBuilder<T extends string> = (
  node: T extends mdast.Content['type']
    ? Extract<
        mdast.Content,
        {
          type: T;
        }
      >
    : unknown,
  next: (children: any[]) => any,
) => object | undefined;

export type OverridedMdastBuilders = {
  [key in mdast.Content['type']]?: MdastBuilder<key>;
} & (
  | {
      [key: string]: MdastBuilder<typeof key>;
    }
  | {}
);
