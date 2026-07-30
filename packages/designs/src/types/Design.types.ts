import { PropertiesSchema } from '@minddrop/properties';
import { Layout } from './Layout.types';

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The design's properties. Layout elements bind to these by name;
   * databases that use this design provide a name-to-name map from
   * their own properties to these.
   */
  properties: PropertiesSchema;

  /**
   * The layouts inside this design, in z-order (later entries render
   * on top of earlier ones).
   */
  layouts: Layout[];

  /**
   * The date the design was created.
   */
  created: Date;

  /**
   * The date the design was last modified.
   */
  lastModified: Date;
}
