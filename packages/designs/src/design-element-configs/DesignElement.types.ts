import type { DesignRoleId } from '../types';
import type { ContainerElement } from './container';
import type { PagePanelElement } from './page-panel';
import type { PropertyElement } from './property';
import type { RootElement } from './root';
import type { TextElement } from './text';

/**
 * Union of all leaf (non-container) design element types.
 */
export type LeafDesignElement = TextElement | PropertyElement;

/**
 * Union of all design element types.
 */
export type DesignElement =
  | LeafDesignElement
  | ContainerElement
  | PagePanelElement
  | RootElement;

/**
 * Union of all design element type identifiers.
 */
export type DesignElementType = DesignElement['type'];

/**
 * A design element playing a registered role: a basic element
 * extended with the role tag. The role's variant styles are locked
 * over the element's own style at resolution time.
 */
export type RoleDesignElement<TElement extends DesignElement = DesignElement> =
  TElement & {
    /**
     * The registered design role the element plays (e.g.
     * 'title').
     */
    role: DesignRoleId;

    /**
     * The element's selected role variant per axis, as an
     * [axis ID]: [option ID] map. Axes omitted or set to an
     * unknown option use the axis default option.
     */
    roleVariants?: Record<string, string>;
  };

/**
 * A design element as seen by style resolution and CSS generation,
 * which read an element's type, style and role only. Container
 * children are dropped from the shape so that elements holding
 * their children as ID references resolve styles the same way.
 */
export type DesignElementStyleSource<TElement = DesignElement> =
  TElement extends DesignElement ? Omit<TElement, 'children'> : never;

/**
 * Strips the `id` field from an element type to produce
 * a template type used when creating new elements.
 */
type Template<T> = Omit<T, 'id'>;

/**
 * Union of all design element template types (element without id).
 */
export type DesignElementTemplate =
  | Template<TextElement>
  | Template<PropertyElement>
  | Template<ContainerElement>
  | Template<PagePanelElement>;
