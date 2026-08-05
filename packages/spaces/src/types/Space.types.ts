import { Layout } from '@minddrop/designs';
import { EntityId } from '@minddrop/utils';

export type SpaceId = EntityId<'space'>;

export interface Space {
  /**
   * A unique identifier for the space.
   */
  id: SpaceId;

  /**
   * The user defined name of the space.
   */
  name: string;

  /**
   * The space icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon: string;

  /**
   * The space's layout. Always a space type layout, owned by the
   * space rather than referencing a design.
   */
  layout: Layout;

  /**
   * The date the space was created.
   */
  created: Date;

  /**
   * The date the space was last modified.
   */
  lastModified: Date;
}

export type UpdateSpaceData = Partial<Pick<Space, 'name' | 'icon' | 'layout'>>;
