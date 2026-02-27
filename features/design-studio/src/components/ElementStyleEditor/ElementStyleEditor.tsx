import { useTranslation } from '@minddrop/i18n';
import {
  Button,
  FlexItem,
  Group,
  Icon,
  InputLabel,
  ScrollArea,
  Stack,
  Text,
  Toolbar,
} from '@minddrop/ui-primitives';
import {
  DesignStudioStore,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import { iconMap, labelMap } from '../ElementsTree/ElementsTreeNode';
import { BackgroundColorSelect } from '../style-editors/BackgroundColorSelect';
import { Border } from '../style-editors/Border';
import { ContainerTypography } from '../style-editors/ContainerTypography';
import { DirectionToggle } from '../style-editors/DirectionToggle';
import { GapField } from '../style-editors/GapField';
import { PaddingField } from '../style-editors/PaddingField';
import { PositionGrid } from '../style-editors/PositionGrid';
import { Typography } from '../style-editors/Typography';
import { WrapSwitch } from '../style-editors/WrapSwitch';
import './ElementStyleEditor.css';

const textLikeTypes = new Set([
  'text',
  'formatted-text',
  'number',
  'url',
]);

const containerTypes = new Set(['root', 'container']);

const SectionLabel: React.FC<{ label: string }> = ({ label }) => {
  const { t } = useTranslation();

  return <span className="element-style-editor-section-label">{t(label)}</span>;
};

export const ElementStyleEditor: React.FC = () => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const designType = useDesignStudioStore((state) => state.design?.type);
  const element = useElement(selectedElementId || '');

  if (!selectedElementId || !element) {
    return null;
  }

  const icon = iconMap[element.type] || 'box';
  const label =
    element.type === 'root' && designType
      ? `designs.${designType}.name`
      : labelMap[element.type] || element.type;

  const handleClickBack = () => {
    DesignStudioStore.getState().selectElement(null);
  };

  return (
    <div className="element-style-editor">
      <Toolbar>
        <Button
          variant="ghost"
          startIcon="chevron-left"
          label="actions.back"
          onClick={handleClickBack}
        />
      </Toolbar>

      <ScrollArea>
        <Stack gap={6} className="element-style-editor-content">
          <Group gap={2} className="element-style-editor-header">
            <Icon name={icon} className="element-style-editor-icon" />
            <Text size="sm" weight="medium" text={label} />
          </Group>

          {containerTypes.has(element.type) && (
            <>
              <Stack gap={3}>
                <SectionLabel label="designs.layout.label" />
                <DirectionToggle elementId={selectedElementId} />
                <Stack gap={1}>
                  <InputLabel size="xs" label="designs.position.label" />
                  <PositionGrid elementId={selectedElementId} />
                </Stack>
                <Group gap={2}>
                  <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
                    <Stack gap={1}>
                      <InputLabel size="xs" label="designs.gap.label" />
                      <GapField elementId={selectedElementId} />
                    </Stack>
                  </FlexItem>
                  <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
                    <Stack gap={1}>
                      <InputLabel size="xs" label="designs.padding.label" />
                      <PaddingField elementId={selectedElementId} />
                    </Stack>
                  </FlexItem>
                </Group>
                <WrapSwitch elementId={selectedElementId} />
              </Stack>

              <Stack gap={3}>
                <SectionLabel label="designs.background-color.label" />
                <BackgroundColorSelect elementId={selectedElementId} />
              </Stack>

              <Stack gap={3}>
                <SectionLabel label="designs.border.label" />
                <Border elementId={selectedElementId} />
              </Stack>

              <Stack gap={3}>
                <SectionLabel label="designs.typography.label" />
                <Text
                  size="xs"
                  color="subtle"
                  text="designs.typography.container-hint"
                />
                <ContainerTypography elementId={selectedElementId} />
              </Stack>
            </>
          )}

          {textLikeTypes.has(element.type) && (
            <Stack gap={3}>
              <SectionLabel label="designs.typography.label" />
              <Typography elementId={selectedElementId} />
            </Stack>
          )}
        </Stack>
      </ScrollArea>
    </div>
  );
};
