import {
  Button,
  Group,
  Icon,
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
import { elementIconMap, elementLabelMap } from '../../constants';
import { ContainerElementStyleEditor } from '../style-editors/ContainerElementStyleEditor';
import { FormattedTextElementStyleEditor } from '../style-editors/FormattedTextElementStyleEditor';
import { ImageElementStyleEditor } from '../style-editors/ImageElementStyleEditor';
import { NumberElementStyleEditor } from '../style-editors/NumberElementStyleEditor';
import { TextElementStyleEditor } from '../style-editors/TextElementStyleEditor';
import './ElementStyleEditor.css';

const containerTypes = new Set(['root', 'container']);

export const ElementStyleEditor: React.FC = () => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const designType = useDesignStudioStore((state) => state.design?.type);
  const element = useElement(selectedElementId || '');

  if (!selectedElementId || !element) {
    return null;
  }

  const icon = elementIconMap[element.type] || 'box';
  const label =
    element.type === 'root' && designType
      ? `designs.${designType}.name`
      : elementLabelMap[element.type] || element.type;

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
            <ContainerElementStyleEditor
              elementId={selectedElementId}
              isRoot={element.type === 'root'}
              showMinHeight={
                !(element.type === 'root' && designType === 'page')
              }
            />
          )}

          {(element.type === 'text' || element.type === 'url') && (
            <TextElementStyleEditor elementId={selectedElementId} />
          )}

          {element.type === 'formatted-text' && (
            <FormattedTextElementStyleEditor elementId={selectedElementId} />
          )}

          {element.type === 'number' && (
            <NumberElementStyleEditor elementId={selectedElementId} />
          )}

          {element.type === 'image' && (
            <ImageElementStyleEditor elementId={selectedElementId} />
          )}
        </Stack>
      </ScrollArea>
    </div>
  );
};
