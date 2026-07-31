import { useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  Stack,
  Text,
  Toggle,
} from '@minddrop/ui-primitives';
import {
  setDesignElement,
  updateDesignElement,
  updateElementStyle,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import { ElementPropertyField } from '../../style-editors/ElementPropertyField';
import { FlatDesignElement } from '../../types';
import { isPropertyCompatibleWithElement } from '../../utils';
import { BackgroundImageField } from './BackgroundImageField';

type BackgroundImageMode = 'none' | 'property' | 'static';

export interface BackgroundImageSourceProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the background image source controls for container and
 * root elements: a mode toggle between no image, property
 * binding, and a static image, followed by the property select
 * or the static image picker for the active mode.
 */
export const BackgroundImageSource: React.FC<BackgroundImageSourceProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const element = useElement(elementId);
  // The unbound property mode persists identically to the none
  // mode, so the explicit toggle choice is tracked locally
  const [mode, setMode] = useState<BackgroundImageMode>(() =>
    element ? deriveMode(element) : 'none',
  );
  const designProperties = useDesignStudioStore(
    (state) => state.design?.properties || [],
  );

  // Switch the background image mode, clearing the inactive
  // modes' values
  function handleModeChange(value: string) {
    if (!element) {
      return;
    }

    setMode(value as BackgroundImageMode);

    // Remove the property binding when leaving property mode
    // (via outright element replacement, since the update merge
    // cannot unset a field)
    const { property: _removed, ...unboundElement } = element;

    if (value === 'static') {
      setDesignElement(elementId, { ...unboundElement, static: true });

      return;
    }

    if (value === 'none') {
      setDesignElement(elementId, { ...unboundElement, static: false });
      updateElementStyle(elementId, 'backgroundImage', '');

      return;
    }

    // Property mode: clear the static image, binding happens via
    // the property select
    updateDesignElement(elementId, {
      static: false,
      style: { backgroundImage: '' },
    });
  }

  if (!element) {
    return null;
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

  return (
    <>
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.image.label" />
        <RadioToggleGroup
          size="md"
          value={mode}
          onValueChange={handleModeChange}
        >
          <Toggle value="none" label={t('designs.content.mode.none')} />
          <Toggle value="property" label={t('designs.content.mode.property')} />
          <Toggle value="static" label={t('designs.content.mode.static')} />
        </RadioToggleGroup>
      </Stack>
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
      {mode === 'static' && <BackgroundImageField elementId={elementId} />}
    </>
  );
};

/**
 * Derives the background image mode from the element's persisted
 * state.
 */
function deriveMode(element: FlatDesignElement): BackgroundImageMode {
  if (element.static) {
    return 'static';
  }

  if (element.property) {
    return 'property';
  }

  return 'none';
}
