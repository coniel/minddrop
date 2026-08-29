import {
  DesignRoles,
  getElementConfig,
  isPropertyElement,
  isRoleElement,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Text, Toggle } from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import { FlatDesignElement } from '../../types';
import {
  isPropertyCompatibleWithElement,
  isStaticContentElement,
} from '../../utils';
import { PanelSection } from '../PanelSection';
import { ElementPropertyField } from './ElementPropertyField';
import { StaticContentField } from './StaticContentField';

// Element types binding their image property from the background
// fields of their style editor instead
const BackgroundImageElementTypes = ['container', 'root', 'page-panel'];

// Element types whose static content is a reference set elsewhere
// rather than editable text
const ReferenceContentElementTypes = ['data-view'];

export interface ElementContentSectionProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the element's content source: a toggle between binding
 * a design property and displaying static content, followed by
 * the controls for the active mode. Renders nothing when the
 * element has neither a bindable property nor content of its own.
 */
export const ElementContentSection: React.FC<ElementContentSectionProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const studio = useDesignStudio();
  const element = useElement(elementId);
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  const propertyBindingEnabled = useDesignStudioStore(
    (state) => state.propertyBindingEnabled,
  );

  // Switch the element between bound and static content, clearing
  // the mode being left behind
  function handleModeChange(value: string) {
    if (!element) {
      return;
    }

    if (value === 'static') {
      // Drop the binding by replacing the element, since a merge
      // cannot unset a field
      const { property: _removed, ...unboundElement } = element;

      studio.setDesignElement(elementId, {
        ...unboundElement,
        static: true,
      });

      return;
    }

    // Clear the static content when returning to bound mode
    studio.updateDesignElement(elementId, { static: false, content: '' });

    // Bind the first compatible property left unbound, so the
    // switch lands on a working binding when one is available
    studio.autoBindDesignElement(elementId);
  }

  if (!element) {
    return null;
  }

  // Containers bind their background image from the background
  // fields instead, so they have no content section
  if (BackgroundImageElementTypes.includes(element.type)) {
    return null;
  }

  // Data view elements hold the ID of the data view they render,
  // set by creating the view rather than by typing it
  if (ReferenceContentElementTypes.includes(element.type)) {
    return null;
  }

  // The element's role content restriction, when it plays a role
  const roleMode = resolveRoleContentMode(element);

  // Element types which are always property bound offer no static
  // mode, so they show no content mode toggle. A role can restrict
  // the same way when it only makes sense rendering bound data.
  const supportsContent =
    Boolean(getElementConfig(element.type).supportsStaticContent) &&
    roleMode !== 'bound';

  // Static-only roles never bind a property
  const supportsBinding = roleMode !== 'static';

  // A property element holds nothing but its binding, so its
  // section is named after the binding and the select inside it
  // goes unlabelled
  const isProperty = isPropertyElement(element);
  const sectionLabel = isProperty
    ? 'designs.property.label'
    : 'designs.content.label';

  // Without property binding, and for static-only roles, there is
  // only static content to set
  if (!propertyBindingEnabled || !supportsBinding) {
    if (!supportsContent) {
      return null;
    }

    return (
      <PanelSection label={sectionLabel}>
        <StaticContentField elementId={elementId} />
      </PanelSection>
    );
  }

  // The properties this element could bind to, ignoring whether
  // it is currently static
  const compatibleProperties = properties.filter((property) =>
    isPropertyCompatibleWithElement(property.type, {
      ...element,
      static: false,
    }),
  );

  const hasCompatibleProperties = compatibleProperties.length > 0;

  // Neither a binding nor content to configure
  if (!hasCompatibleProperties && !supportsContent) {
    return null;
  }

  const mode = isStaticContentElement(element) ? 'static' : 'property';

  return (
    <PanelSection label={sectionLabel}>
      {supportsContent && (
        <RadioToggleGroup
          size="md"
          value={mode}
          onValueChange={handleModeChange}
        >
          <Toggle value="property" label={t('designs.content.mode.property')} />
          <Toggle value="static" label={t('designs.content.mode.static')} />
        </RadioToggleGroup>
      )}

      {/** Bound mode: the property select **/}
      {mode === 'property' && hasCompatibleProperties && (
        <ElementPropertyField
          elementId={elementId}
          label={isProperty ? undefined : 'designs.property.label'}
        />
      )}
      {mode === 'property' && !hasCompatibleProperties && (
        <Text
          block
          size="sm"
          color="muted"
          text="designs.property.noCompatible"
        />
      )}

      {/** Static mode: the content input for the element type **/}
      {mode === 'static' && supportsContent && (
        <StaticContentField elementId={elementId} />
      )}
    </PanelSection>
  );
};

/**
 * Resolves the element's role content restriction: 'bound' or
 * 'static' when its role limits content to one mode, undefined
 * otherwise. Elements without a registered role restrict nothing.
 */
function resolveRoleContentMode(
  element: FlatDesignElement,
): 'bound' | 'static' | undefined {
  // Elements without a role restrict nothing
  if (!isRoleElement(element)) {
    return undefined;
  }

  return DesignRoles.get(element.role, false)?.contentMode;
}
