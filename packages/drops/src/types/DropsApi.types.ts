import { RootContent } from '@minddrop/markdown';
import { Drop } from './Drop.types';

export interface DropsApi {
  /**
   * Identifies a drop's type based on its child MD AST nodes.
   *
   * @params children - The drop's child MD AST nodes.
   * @returns The drop type.
   */
  getType(children: Drop['children']): Drop['type'];

  /**
   * Generats drops from MD AST nodes.
   *
   * @param nodes - The MD AST nodes.
   * @returns Drops
   */
  fromMdast(nodes: RootContent[]): Drop[];
}
