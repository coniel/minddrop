import { useState } from 'react';
import {
  LayoutType,
  defaultRootStyle,
  getElementConfig,
} from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import { PanelView } from '@minddrop/ui-components';
import {
  IconButton,
  ScrollArea,
  Stack,
  Text,
  TransientViewStateScope,
} from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { resolveNodeLabel } from '../ElementsTree';
import {
  ElementContentSection,
  StyleSectionResetContext,
  VariantAxisFields,
  elementFormatEditors,
  styleCategoryEditors,
} from '../style-editors';
import { hasPagePanels } from '../utils';
import './ElementStyleEditor.css';

const layoutTypeKey = createI18nKeyBuilder('designs.layouts.');

/**
 * Renders the style panel for the element selected on the canvas:
 * its identity, the variant axes its design role offers, and the
 * style editor for its style category. Style keys the role
 * controls are left out entirely, so the panel never offers an
 * edit the role would override.
 */
export const ElementStyleEditor: React.FC = () => {
  const [resetSignal, setResetSignal] = useState(0);
  const studio = useDesignStudio();
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const activeLayoutId = useDesignStudioStore((state) => state.activeLayoutId);
  const layoutType = useActiveLayoutType();
  const element = useElement(selectedElementId || '');

  // Reset the element's styling outright: replacing the element
  // is what unsets keys a merge cannot remove
  function handleClearStyling() {
    if (!selectedElementId || !element) {
      return;
    }

    if (element.type === 'root') {
      // A root resets to its layout type's default styling. A
      // panelled root's row arrangement is structure rather than
      // styling, so it survives the reset along with the panels.
      const defaults = defaultRootStyle(element.layoutType ?? undefined);

      studio.setDesignElement(selectedElementId, {
        ...element,
        style: hasPagePanels(studio, element)
          ? { ...defaults, direction: 'row' }
          : defaults,
      });
    } else {
      studio.setDesignElement(selectedElementId, { ...element, style: {} });
    }

    // Collapse the sections left open by hand, so the cleared
    // panel does not linger expanded
    setResetSignal((signal) => signal + 1);
  }

  // Nothing selected, or the selection has been deleted
  if (!selectedElementId || !element) {
    return (
      <PanelView className="designs-element-style-editor" breadcrumbs={[]}>
        <Text
          block
          size="sm"
          color="subtle"
          className="designs-element-style-editor-empty"
          text="designsStudio.editor.empty"
        />
      </PanelView>
    );
  }

  const config = getElementConfig(element.type);
  // The element's display identity: its role's label and icon when
  // it plays one, the element type's otherwise
  const nodeLabel = resolveNodeLabel(element);
  const StyleEditor = styleCategoryEditors[config.styleCategory];
  // Only element types which format their value have one
  const FormatEditor = elementFormatEditors[element.type];

  // The reset appears once there is styling to clear
  const actions =
    Object.keys(element.style).length > 0
      ? [
          <IconButton
            key="clear"
            icon="eraser"
            label="designs.clear-custom-styling"
            color="neutral"
            danger="on-hover"
            tooltip={{
              title: 'designs.clear-custom-styling',
              delay: 0,
              side: 'left',
            }}
            onClick={handleClearStyling}
          />,
        ]
      : undefined;

  return (
    <PanelView
      className="designs-element-style-editor"
      breadcrumbs={[]}
      icon={nodeLabel.icon}
      title={resolveElementLabel(element.type, nodeLabel.label, layoutType)}
      actions={actions}
    >
      <ScrollArea stateKey="style-editor-scroll">
        {/** Each element keeps its own panel state, as it does its
         * own styles. The layout scopes it too: every layout's
         * root shares the id "root". **/}
        <TransientViewStateScope
          segment={`${activeLayoutId}:${selectedElementId}`}
        >
          <StyleSectionResetContext.Provider value={resetSignal}>
            <Stack gap={0}>
              {/** What the element displays: a bound property or its own content **/}
              <ElementContentSection
                key={`content-${selectedElementId}`}
                elementId={selectedElementId}
              />

              {/** How the element's value is formatted, per element type **/}
              {FormatEditor && (
                <FormatEditor
                  key={`format-${selectedElementId}`}
                  elementId={selectedElementId}
                />
              )}

              {/** Variant pickers, for elements playing a design role **/}
              <VariantAxisFields elementId={selectedElementId} />

              {/** The style fields of the element's style category **/}
              <StyleEditor
                key={selectedElementId}
                elementId={selectedElementId}
              />
            </Stack>
          </StyleSectionResetContext.Provider>
        </TransientViewStateScope>
      </ScrollArea>
    </PanelView>
  );
};

/**
 * Resolves the panel heading: a layout root is named after the
 * layout it belongs to, since "Root" says nothing about which
 * frame is being styled.
 */
function resolveElementLabel(
  elementType: string,
  elementLabel: TranslationKey,
  layoutType: LayoutType | null,
): TranslationKey {
  if (elementType === 'root' && layoutType) {
    return layoutTypeKey(layoutType, 'name');
  }

  return elementLabel;
}
