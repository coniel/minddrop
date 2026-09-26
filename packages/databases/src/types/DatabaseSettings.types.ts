import { DatabaseContentDefaults } from './DatabaseContentDefaults.types';
import { DatabaseDefaults } from './DatabaseDefaults.types';

/**
 * The global database settings, grouped by concern.
 */
export interface DatabaseSettings {
  /**
   * The defaults applied to newly created databases.
   */
  defaults: DatabaseDefaults;

  /**
   * The databases that content added from outside the app is added to.
   */
  contentDefaults: DatabaseContentDefaults;
}
