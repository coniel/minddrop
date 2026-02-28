import {
  FlexItem,
  Group,
  InputLabel,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { BackgroundColorSelect } from '../BackgroundColorSelect';
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
