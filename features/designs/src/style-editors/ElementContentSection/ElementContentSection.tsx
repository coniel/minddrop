import {
  DesignRoles,
  getElementConfig,
  isRoleElement,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Text, Toggle } from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import { DefaultStaticIcon } from '../../constants';
import { FlatDesignElement } from '../../types';
import {
  isPropertyCompatibleWithElement,
  isStaticContentElement,
} from '../../utils';
import { PanelSection } from '../PanelSection';
import { DateContentField } from './DateContentField';
import { ElementPropertyField } from './ElementPropertyField';
import { IconContentField } from './IconContentField';
import { ImageContentField } from './ImageContentField';
import { NumberContentField } from './NumberContentField';
import { StaticContentField } from './StaticContentField';

// Element types whose static content is an image file
const ImageContentTypes = ['image', 'image-viewer'];

// Element types binding their image property from the background
// fields of their style editor instead
const BackgroundImageElementTypes = ['container', 'root', 'page-panel'];

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

      // Give an icon element something visible to start from
      const iconDefault =
        element.type === 'icon' && !element.icon
          ? { icon: DefaultStaticIcon }
          : {};

      studio.setDesignElement(elementId, {
        ...unboundElement,
        ...iconDefault,
        static: true,
      });

      return;
    }

    // Clear the static content when returning to bound mode
    if (element.type === 'icon') {
      studio.updateDesignElement(elementId, { static: false, icon: '' });
    } else {
      studio.updateDesignElement(elementId, { static: false, content: '' });
    }

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

  // Element types which are always property bound offer no static
  // mode, so they show no content mode toggle. A role can restrict
  // the same way when it only makes sense rendering bound data.
  const supportsContent =
    Boolean(getElementConfig(element.type).supportsStaticContent) &&
    roleSupportsStaticContent(element);

  // Without property binding there is only static content to set
  if (!propertyBindingEnabled) {
    if (!supportsContent) {
      return null;
    }

    return (
      <PanelSection label="designs.content.label">
        <ContentField elementId={elementId} type={element.type} />
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
    <PanelSection label="designs.content.label">
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
        <ElementPropertyField elementId={elementId} />
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
        <ContentField elementId={elementId} type={element.type} />
      )}
    </PanelSection>
  );
};

interface ContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * The element type, which decides the kind of input shown.
   */
  type: string;
}

/**
 * Renders the static content input matching the element type.
 */
const ContentField: React.FC<ContentFieldProps> = ({ elementId, type }) => {
  if (type === 'icon') {
    return <IconContentField elementId={elementId} />;
  }

  if (ImageContentTypes.includes(type)) {
    return <ImageContentField elementId={elementId} />;
  }

  if (type === 'date') {
    return <DateContentField elementId={elementId} />;
  }

  if (type === 'number') {
    return <NumberContentField elementId={elementId} />;
  }

  return <StaticContentField elementId={elementId} />;
};

/**
 * Checks whether the element's role offers static content, which
 * elements without a registered role always do.
 */
function roleSupportsStaticContent(element: FlatDesignElement): boolean {
  // Elements without a role restrict nothing
  if (!isRoleElement(element)) {
    return true;
  }

  return DesignRoles.Store.get(element.role)?.supportsStaticContent ?? true;
}
