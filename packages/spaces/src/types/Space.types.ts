import { VirtualDesignData } from '@minddrop/designs';
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
   */
  icon: string;

  /**
   * The space's design, owned and persisted by the space and
   * loaded into the designs store as a virtual design. Always a
   * space type design holding a single space layout.
   */
  design: VirtualDesignData;

  /**
   * The date the space was created.
   */
  created: Date;

  /**
   * The date the space was last modified.
   */
  lastModified: Date;
}

export type UpdateSpaceData = Partial<Pick<Space, 'name' | 'icon' | 'design'>>;
