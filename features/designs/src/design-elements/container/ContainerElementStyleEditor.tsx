import {
  DefaultContainerStyles,
  DefaultTypographyStyles,
} from '@minddrop/designs';
import {
  FlexItem,
  Group,
  InputLabel,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import {
  useDesignStudioStore,
  useElement,
  useElementStyle,
} from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { ContainerTypography } from '../../style-editors/ContainerTypography';
import { PaddingFields } from '../../style-editors/PaddingFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { BackdropBlurGradientDirectionToggle } from './BackdropBlurGradientDirectionToggle';
import { BackdropBlurGradientExtentSlider } from './BackdropBlurGradientExtentSlider';
import { BackdropBlurGradientSwitch } from './BackdropBlurGradientSwitch';
import { BackdropBlurField } from './BackdropBlurSlider';
import { BackdropBrightnessField } from './BackdropBrightnessSlider';
import { BackgroundColorSelect } from './BackgroundColorSelect';
import { BackgroundImageField } from './BackgroundImageField';
import { BackgroundImageFitSelect } from './BackgroundImageFitSelect';
import { DirectionToggle } from './DirectionToggle';
import { GapField } from './GapField';
import { MinHeightField } from './MinHeightField';
import { PositionGrid } from './PositionGrid';
import { StretchSwitch } from './StretchSwitch';
import { WrapSwitch } from './WrapSwitch';

export interface ContainerElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the padding collapsible section
const paddingDefaults = {
  paddingTop: DefaultContainerStyles.paddingTop,
  paddingRight: DefaultContainerStyles.paddingRight,
  paddingBottom: DefaultContainerStyles.paddingBottom,
  paddingLeft: DefaultContainerStyles.paddingLeft,
} as const;

// Default values for the background collapsible section
const backgroundDefaults = {
  backgroundColor: 'transparent',
  backgroundImage: DefaultContainerStyles.backgroundImage,
  backdropBlur: DefaultContainerStyles.backdropBlur,
  backdropBrightness: DefaultContainerStyles.backdropBrightness,
} as const;

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderWidth: DefaultContainerStyles.borderWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultContainerStyles.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultContainerStyles.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultContainerStyles.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultContainerStyles.borderRadiusBottomLeft,
} as const;

// Default values for the typography collapsible section
const typographyDefaults = {
  'font-family': DefaultTypographyStyles['font-family'],
  'font-weight': DefaultTypographyStyles['font-weight'],
  color: DefaultTypographyStyles.color,
  opacity: DefaultTypographyStyles.opacity,
} as const;

/**
 * Renders the style editor panel for container and root elements.
 * Derives isRoot and showMinHeight from the store automatically.
 */
export const ContainerElementStyleEditor: React.FC<
  ContainerElementStyleEditorProps
> = ({ elementId }) => {
  const element = useElement(elementId);
  const designType = useDesignStudioStore((state) => state.design?.type);

  // Root elements hide stretch and conditionally hide min-height
  const isRoot = element.type === 'root';
  const showMinHeight = !(isRoot && designType === 'page');

  const backgroundImage = useElementStyle(elementId, 'backgroundImage');
  const backdropBlur = useElementStyle(elementId, 'backdropBlur');
  const backdropBlurGradient = useElementStyle(
    elementId,
    'backdropBlurGradient',
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.layout.label" />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.direction.label" />
          <DirectionToggle elementId={elementId} />
        </Stack>
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.position.label" />
          <PositionGrid elementId={elementId} />
        </Stack>
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.gap.label" />
              <GapField elementId={elementId} />
            </Stack>
          </FlexItem>
          {showMinHeight && (
            <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
              <Stack gap={1}>
                <InputLabel size="xs" label="designs.min-height.label" />
                <MinHeightField elementId={elementId} />
              </Stack>
            </FlexItem>
          )}
        </Group>
        {!isRoot && <StretchSwitch elementId={elementId} />}
        <WrapSwitch elementId={elementId} />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.padding.label"
        defaultStyles={paddingDefaults}
      >
        <PaddingFields elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.background-color.label"
        defaultStyles={backgroundDefaults}
      >
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.image.label" />
          <BackgroundImageField elementId={elementId} />
        </Stack>
        {backgroundImage && (
          <BackgroundImageFitSelect
            elementId={elementId}
            label="designs.background-image-fit.label"
          />
        )}
        <BackgroundColorSelect elementId={elementId} />
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.backdrop-blur.label" />
              <BackdropBlurField elementId={elementId} />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.backdrop-brightness.label" />
              <BackdropBrightnessField elementId={elementId} />
            </Stack>
          </FlexItem>
        </Group>
        {backdropBlur > 0 && (
          <>
            <BackdropBlurGradientSwitch elementId={elementId} />
            {backdropBlurGradient && (
              <>
                <Stack gap={3}>
                  <InputLabel
                    size="xs"
                    label="designs.backdrop-blur-gradient-direction.label"
                  />
                  <BackdropBlurGradientDirectionToggle elementId={elementId} />
                </Stack>
                <Stack gap={3}>
                  <InputLabel
                    size="xs"
                    label="designs.backdrop-blur-gradient-extent.label"
                  />
                  <BackdropBlurGradientExtentSlider elementId={elementId} />
                </Stack>
              </>
            )}
          </>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.label"
        defaultStyles={borderDefaults}
      >
        <Border elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <BorderRadiusField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.label"
        defaultStyles={typographyDefaults}
      >
        <Text
          size="xs"
          color="subtle"
          text="designs.typography.container-hint"
        />
        <ContainerTypography elementId={elementId} isRoot={isRoot} />
      </CollapsibleSection>
    </>
  );
};
