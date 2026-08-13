import type { PropertiesSchema } from '@minddrop/properties';
import type { EntityId } from '@minddrop/utils';
import type { Layout } from './Layout.types';

export type DesignId = EntityId<'design'>;

/**
 * What a design is for. A separate axis from the layout type, which
 * says what an individual layout renders as.
 */
export type DesignType = 'database' | 'space' | 'component-library';

/**
 * Fields shared by every design type.
 */
interface BaseDesign {
  /**
   * A unique identifier for the design.
   */
  id: DesignId;

  /**
   * The design's user-facing name.
   */
  name: string;

  /**
   * The layouts inside this design, in z-order.
   */
  layouts: Layout[];

  /**
   * Timestamp at which the design was created.
   */
  created: Date;

  /**
   * Timestamp at which the design was last modified.
   */
  lastModified: Date;

  /**
   * Whether the design is virtual (exists only in memory, not
   * persisted to a design bundle of its own).
   */
  virtual?: boolean;

  /**
   * The ID of the entity which owns and persists the design.
   * Only set on virtual designs.
   */
  owner?: EntityId;

  /**
   * Disambiguates multiple virtual designs under one owner. Opaque
   * to the designs API. Only set on virtual designs.
   */
  ownerKey?: string;
}

/**
 * A design rendering database entries. Layout elements bind to the
 * design's properties by name; databases that use the design map
 * their own properties onto them.
 */
export interface DatabaseDesign extends BaseDesign {
  type: 'database';

  /**
   * The design's property schema.
   */
  properties: PropertiesSchema;
}

/**
 * A design rendering a space, owned by the space itself.
 */
export interface SpaceDesign extends BaseDesign {
  type: 'space';
}

/**
 * A design containing only reusable layout templates.
 */
export interface ComponentLibraryDesign extends BaseDesign {
  type: 'component-library';
}

export type Design = DatabaseDesign | SpaceDesign | ComponentLibraryDesign;

/**
 * Data required to create a virtual design.
 */
export type CreateVirtualDesignData = Pick<Design, 'id' | 'type'> & {
  /**
   * The ID of the entity which owns and persists the design.
   */
  owner: EntityId;

  /**
   * Disambiguates multiple virtual designs under one owner.
   */
  ownerKey?: string;

  /**
   * The design's user-facing name.
   */
  name?: string;

  /**
   * The layouts inside this design.
   */
  layouts?: Layout[];
};

/**
 * Strips the load-time derived fields from a design type, keeping
 * the union discriminated.
 */
type OwnerPersistedDesign<T> = T extends Design
  ? Omit<T, 'virtual' | 'created' | 'lastModified'> & {
      /**
       * The ID of the entity which owns and persists the design.
       */
      owner: EntityId;
    }
  : never;

/**
 * The owner-persisted shape of a virtual design. The virtual flag
 * and dates are derived at load time.
 */
export type VirtualDesignData = OwnerPersistedDesign<Design>;
