import { DesignElementComponent } from './types';

/**
 * The registered element renderer components, keyed by element type.
 */
export const ElementRenderersStore = new Map<string, DesignElementComponent>();
