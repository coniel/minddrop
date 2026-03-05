import { Group, Icon, ScrollArea, Stack, Text } from '@minddrop/ui-primitives';
import { useDesignStudioStore, useElement } from '../DesignStudioStore';
import { elementIconMap, elementLabelMap } from '../constants';
import { elementUIMap } from '../design-elements';
import './ElementStyleEditor.css';

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

  // Look up the style editor component from the registry
  const ui = elementUIMap[element.type];
  const StyleEditorComponent = ui?.StyleEditorComponent;

  return (
    <div className="element-style-editor">
      <ScrollArea>
        <Stack gap={6} className="element-style-editor-content">
          <Group gap={2} className="element-style-editor-header">
            <Icon name={icon} className="element-style-editor-icon" />
            <Text size="sm" weight="medium" text={label} />
          </Group>

          {StyleEditorComponent && (
            <StyleEditorComponent
              key={selectedElementId}
              elementId={selectedElementId}
            />
          )}
        </Stack>
      </ScrollArea>
    </div>
  );
};
