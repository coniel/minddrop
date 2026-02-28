import {
  FlexItem,
  Group,
  InputLabel,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { useElementStyle } from '../../../DesignStudioStore';
import { BackdropBlurGradientDirectionToggle } from '../BackdropBlurGradientDirectionToggle';
import { BackdropBlurGradientExtentSlider } from '../BackdropBlurGradientExtentSlider';
import { BackdropBlurGradientSwitch } from '../BackdropBlurGradientSwitch';
import { BackdropBlurSlider } from '../BackdropBlurSlider';
import { BackdropBrightnessSlider } from '../BackdropBrightnessSlider';
import { BackgroundColorSelect } from '../BackgroundColorSelect';
import { BackgroundImageField } from '../BackgroundImageField';
import { BackgroundImageFitSelect } from '../BackgroundImageFitSelect';
import { Border } from '../Border';
import { ContainerTypography } from '../ContainerTypography';
import { DirectionToggle } from '../DirectionToggle';
import { GapField } from '../GapField';
import { MinHeightField } from '../MinHeightField';
import { PaddingFields } from '../PaddingFields/PaddingFields';
import { PositionGrid } from '../PositionGrid';
import { SectionLabel } from '../SectionLabel';
import { StretchSwitch } from '../StretchSwitch';
import { WrapSwitch } from '../WrapSwitch';

export interface ContainerElementStyleEditorProps {
  elementId: string;
  isRoot?: boolean;
  showMinHeight?: boolean;
}

export const ContainerElementStyleEditor: React.FC<
  ContainerElementStyleEditorProps
> = ({ elementId, isRoot, showMinHeight = true }) => {
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
        <DirectionToggle elementId={elementId} />
        {!isRoot && <StretchSwitch elementId={elementId} />}
        <WrapSwitch elementId={elementId} />
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
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.padding.label" />
          <PaddingFields elementId={elementId} />
        </Stack>
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.background-color.label" />
        <BackgroundColorSelect elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.background-image.label" />
          <BackgroundImageField elementId={elementId} />
        </Stack>
        {backgroundImage && (
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.background-image-fit.label" />
            <BackgroundImageFitSelect elementId={elementId} />
          </Stack>
        )}
        <Stack gap={3}>
          <InputLabel size="xs" label="designs.backdrop-blur.label" />
          <BackdropBlurSlider elementId={elementId} />
        </Stack>
        <Stack gap={3}>
          <InputLabel size="xs" label="designs.backdrop-brightness.label" />
          <BackdropBrightnessSlider elementId={elementId} />
        </Stack>
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
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
        <Text
          size="xs"
          color="subtle"
          text="designs.typography.container-hint"
        />
        <ContainerTypography elementId={elementId} isRoot={isRoot} />
      </Stack>
    </>
  );
};
