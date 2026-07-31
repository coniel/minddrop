import { createI18nKeyBuilder } from '@minddrop/i18n';
import { Group, Icon, ScrollArea, Stack, Text } from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { elementIconMap, elementLabelMap } from '../constants';
import { elementUIMap } from '../design-elements';
import { ElementContentSection } from '../style-editors/ElementContentSection';
import './ElementStyleEditor.css';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

export const ElementStyleEditor: React.FC = () => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const layoutType = useActiveLayoutType();
  const element = useElement(selectedElementId || '');

  if (!selectedElementId || !element) {
    return null;
  }

  const icon = elementIconMap[element.type] || 'box';
  const label =
    element.type === 'root' && layoutType
      ? layoutTypeI18nKey(layoutType, 'name')
      : elementLabelMap[element.type];

  // Look up the style editor component from the registry
  const ui = elementUIMap[element.type];
  const StyleEditorComponent = ui?.StyleEditorComponent;

  return (
    <div className="element-style-editor">
      <ScrollArea>
        <Stack gap={0} className="element-style-editor-content">
          <Group gap={2} className="element-style-editor-header">
            <Icon name={icon} className="element-style-editor-icon" />
            <Text
              size="sm"
              weight="medium"
              text={label || <>{element.type}</>}
            />
          </Group>

          <ElementContentSection
            key={`content-${selectedElementId}`}
            elementId={selectedElementId}
          />

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
