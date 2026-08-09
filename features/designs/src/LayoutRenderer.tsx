import { Layout } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { TransientViewStateScope } from '@minddrop/ui-primitives';
import { DesignRootElement } from './DesignElements';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
  DesignPropertySchemasProvider,
} from './DesignPropertiesProvider';
import { LayoutAutoFocusProvider } from './LayoutAutoFocusContext';
import { LayoutIdProvider } from './LayoutIdContext';
import { LayoutRenderContextProvider } from './LayoutRenderContext';

export interface LayoutRendererProps
  extends Pick<
    DesignPropertiesProviderProps,
    | 'onUpdatePropertyValue'
    | 'onValidatePropertyValue'
    | 'onUpdateElementContent'
    | 'properties'
    | 'propertyValues'
    | 'propertyMap'
  > {
  /**
   * The layout to render.
   */
  layout: Layout;

  /**
   * The context in which the layout is rendered (e.g. `page`,
   * `dialog`). Scopes runtime UI state such as panel widths so the
   * same layout can be sized differently per context.
   */
  context?: string;

  /**
   * The property schemas of the layout's parent design, used to
   * resolve element placeholder values.
   */
  designProperties?: PropertiesSchema;

  /**
   * When true, the first editor element in the layout autofocuses
   * on mount.
   */
  autoFocusEditor?: boolean;
}

/**
 * Renders a layout with real property values bound via propertyMap.
 * Wraps the layout tree in a DesignPropertiesProvider so that
 * child element renderers can access mapped property data.
 */
export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout,
  context,
  autoFocusEditor = false,
  designProperties = [],
  properties = [],
  propertyValues = {},
  propertyMap = {},
  onUpdatePropertyValue,
  onValidatePropertyValue,
  onUpdateElementContent,
}) => {
  return (
    <DesignPropertySchemasProvider properties={designProperties}>
      <DesignPropertiesProvider
        properties={properties}
        propertyValues={propertyValues}
        propertyMap={propertyMap}
        onUpdatePropertyValue={onUpdatePropertyValue}
        onValidatePropertyValue={onValidatePropertyValue}
        onUpdateElementContent={onUpdateElementContent}
      >
        <LayoutIdProvider value={layout.id}>
          <LayoutRenderContextProvider value={context ?? null}>
            <LayoutAutoFocusProvider autoFocus={autoFocusEditor}>
              <TransientViewStateScope segment={layout.id}>
                <DesignRootElement element={layout.tree} />
              </TransientViewStateScope>
            </LayoutAutoFocusProvider>
          </LayoutRenderContextProvider>
        </LayoutIdProvider>
      </DesignPropertiesProvider>
    </DesignPropertySchemasProvider>
  );
};
