import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Stack, Text, Toggle } from '@minddrop/ui-primitives';
import {
  setDesignElement,
  updateDesignElement,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { CONTENT_ELEMENT_TYPES, DEFAULT_STATIC_ICON } from '../constants';
import { isPropertyCompatibleWithElement } from '../utils';
import { DateContentField } from './DateContentField';
import { ElementEmptyBehaviorField } from './ElementEmptyBehaviorField';
import { ElementPropertyField } from './ElementPropertyField';
import { IconContentField } from './IconContentField';
import { ImageContentField } from './ImageContentField';
import { NumberContentField } from './NumberContentField';
import { SectionLabel } from './SectionLabel';
import { StaticContentField } from './StaticContentField';

// Element types whose static content is an image file
const IMAGE_CONTENT_TYPES = ['image', 'image-viewer'];

// Element types whose image property binding is configured in the
// Background section of their style editor instead
const BACKGROUND_IMAGE_ELEMENT_TYPES = ['container', 'root', 'page-panel'];

export interface ElementContentSectionProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the element's content source controls: a mode toggle
 * between property binding and static content, followed by the
 * property select or the type-appropriate content input for the
 * active mode. Renders nothing when the element has neither a
 * bindable design property nor a content input.
 */
export const ElementContentSection: React.FC<ElementContentSectionProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const element = useElement(elementId);
  const designProperties = useDesignStudioStore(
    (state) => state.design?.properties || [],
  );
  const propertyBindingEnabled = useDesignStudioStore(
    (state) => state.propertyBindingEnabled,
  );

  // Toggle the element between property and static content mode,
  // clearing the inactive mode's value
  function handleModeChange(value: string) {
    if (!element) {
      return;
    }

    // Remove the property binding when switching to static mode
    // (via outright element replacement, since the update merge
    // cannot unset a field)
    if (value === 'static') {
      const { property: _removed, ...unboundElement } = element;

      // Default the icon so static mode has a visible value
      const iconDefault =
        element.type === 'icon' && !element.icon
          ? { icon: DEFAULT_STATIC_ICON }
          : {};

      setDesignElement(elementId, {
        ...unboundElement,
        ...iconDefault,
        static: true,
      });

      return;
    }

    // Clear the static content when switching to property mode
    if (element.type === 'icon') {
      updateDesignElement(elementId, { static: false, icon: '' });
    } else {
      updateDesignElement(elementId, { static: false, content: '' });
    }
  }

  if (!element) {
    return null;
  }

  // Containers and root elements bind their background image
  // property from within the Background section
  if (BACKGROUND_IMAGE_ELEMENT_TYPES.includes(element.type)) {
    return null;
  }

  const supportsContent = CONTENT_ELEMENT_TYPES.includes(element.type);

  // Only static content can be configured when property binding
  // is disabled
  if (!propertyBindingEnabled) {
    if (!supportsContent) {
      return null;
    }

    return (
      <Stack gap={3}>
        <SectionLabel label="designs.content.label" />
        <ContentField elementId={elementId} type={element.type} />
      </Stack>
    );
  }

  // Design properties the element could be bound to, ignoring
  // the current static state
  const compatibleProperties = designProperties.filter((property) =>
    isPropertyCompatibleWithElement(property.type, {
      ...element,
      static: false,
    }),
  );

  const hasCompatibleProperties = compatibleProperties.length > 0;

  // Nothing to configure: no section at all
  if (!hasCompatibleProperties && !supportsContent) {
    return null;
  }

  const mode = element.static ? 'static' : 'property';

  return (
    <Stack gap={3}>
      <SectionLabel label="designs.content.label" />
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
      {mode === 'property' && hasCompatibleProperties && (
        <ElementPropertyField elementId={elementId} />
      )}
      {mode === 'property' && hasCompatibleProperties && element.property && (
        <ElementEmptyBehaviorField elementId={elementId} />
      )}
      {mode === 'property' && !hasCompatibleProperties && (
        <Text
          block
          size="sm"
          color="muted"
          text="designs.property.noCompatible"
        />
      )}
      {mode === 'static' && supportsContent && (
        <ContentField elementId={elementId} type={element.type} />
      )}
    </Stack>
  );
};

interface ContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * The element type.
   */
  type: string;
}

/**
 * Renders the static content input appropriate for the element
 * type.
 */
const ContentField: React.FC<ContentFieldProps> = ({ elementId, type }) => {
  if (type === 'icon') {
    return <IconContentField elementId={elementId} />;
  }

  if (IMAGE_CONTENT_TYPES.includes(type)) {
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
