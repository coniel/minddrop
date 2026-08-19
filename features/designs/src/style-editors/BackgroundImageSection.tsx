import { ObjectFit } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Text, Toggle } from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { FlatDesignElement } from '../types';
import { isPropertyCompatibleWithElement } from '../utils';
import { ElementPropertyField } from './ElementContentSection';
import { PlaceholderImageField } from './PlaceholderImageField';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import {
  fieldLabelKey,
  objectFitOptionKey,
  sectionLabelKey,
} from './styleI18nKeys';
import { StyleEditor } from './useStyleEditor';

// The style keys the section governs, cleared together when the
// section is collapsed
export const BackgroundImageStyleKeys: string[] = [
  'backgroundImage',
  'backgroundImageFit',
];

// Where the background image comes from: a bound image property or
// a static media file. A collapsed section means no image at all
type BackgroundImageMode = 'property' | 'static';

// How the image fits the container box
const BackgroundImageFits: readonly ObjectFit[] = ['cover', 'contain', 'fill'];

export interface BackgroundImageSectionProps {
  /**
   * The ID of the container element to edit.
   */
  elementId: string;

  /**
   * The style editing helpers for the element.
   */
  editor: StyleEditor;
}

/**
 * Renders the background image section of a container's style
 * editor: a source toggle between a bound image property and a
 * static media file, the active source's control, and the fit
 * select. The image layers over the background colour, which shows
 * through while it loads and when a bound property is empty.
 * Clearing the section drops the image source along with the image
 * style keys.
 */
export const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({
  elementId,
  editor,
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
  const { isEditable, getValue, setValue } = editor;

  // Switch the image source, clearing the values of the mode being
  // left behind
  function handleModeChange(value: string) {
    if (!element) {
      return;
    }

    if (value === 'static') {
      // Drop the property binding by replacing the element, since a
      // merge cannot unset a field
      const { property: _removed, ...unboundElement } = element;

      studio.setDesignElement(elementId, { ...unboundElement, static: true });

      return;
    }

    // Property mode: the static image no longer applies
    studio.updateDesignElement(elementId, { static: false });
    setValue('backgroundImage', undefined);

    // Bind the first compatible property left unbound, so the
    // switch lands on a working binding when one is available
    studio.autoBindDesignElement(elementId);
  }

  // Clearing the section also drops the element's image source,
  // which lives on the element rather than in the style keys
  function handleClear() {
    // Read the element fresh, since the section has just unset the
    // image style keys and the rendered snapshot still holds them
    const currentElement = studio.getDesignElement(elementId);

    // Drop the property binding by replacing the element, since a
    // merge cannot unset a field
    const { property: _removed, ...unboundElement } = currentElement;

    studio.setDesignElement(elementId, { ...unboundElement, static: false });
  }

  if (!element || !isEditable('backgroundImage')) {
    return null;
  }

  const mode = deriveMode(element, propertyBindingEnabled);

  // The image properties the element could be bound to, ignoring
  // the current static state
  const compatibleProperties = properties.filter((property) =>
    isPropertyCompatibleWithElement(property.type, {
      ...element,
      static: false,
    }),
  );

  const hasCompatibleProperties = compatibleProperties.length > 0;

  // The image source lives on the element rather than in the style
  // keys, so it keeps the section open on its own
  const hasImageSource = Boolean(element.static) || Boolean(element.property);

  return (
    <StyleSection
      label={sectionLabelKey('backgroundImage')}
      keys={BackgroundImageStyleKeys}
      isEditable={isEditable}
      getValue={getValue}
      setValue={setValue}
      hasCustomValues={hasImageSource}
      onClear={handleClear}
    >
      {/** Without property binding the only source is a static
       * file, so there is no toggle to show **/}
      {propertyBindingEnabled && (
        <RadioToggleGroup
          size="sm"
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

      {/** Static mode: the media file picker **/}
      {mode === 'static' && (
        <PlaceholderImageField
          image={getValue<string>('backgroundImage') ?? ''}
          onSelect={(fileName) => setValue('backgroundImage', fileName)}
          onRemove={() => setValue('backgroundImage', undefined)}
        />
      )}

      <TokenSelect
        label={fieldLabelKey('backgroundImageFit')}
        tokens={BackgroundImageFits}
        value={getValue<ObjectFit>('backgroundImageFit')}
        optionKey={objectFitOptionKey}
        defaultToken="cover"
        onChange={(value) => setValue('backgroundImageFit', value)}
      />
    </StyleSection>
  );
};

/**
 * Derives the background image mode from the element's persisted
 * state.
 */
function deriveMode(
  element: FlatDesignElement,
  propertyBindingEnabled: boolean,
): BackgroundImageMode {
  // A static container displays its chosen media file
  if (element.static) {
    return 'static';
  }

  // Without property binding the only source is a static file
  if (!propertyBindingEnabled) {
    return 'static';
  }

  return 'property';
}
