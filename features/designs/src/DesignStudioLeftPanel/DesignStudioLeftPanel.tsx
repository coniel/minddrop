import { useState } from 'react';
import { generatePropertyPlaceholder } from '@minddrop/designs';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n, useTranslation } from '@minddrop/i18n';
import { PropertySchemaTemplate } from '@minddrop/properties';
import { PanelView } from '@minddrop/ui-components';
import {
  IconButton,
  IconButtonSpacer,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  useTransientState,
} from '@minddrop/ui-primitives';
import {
  DesignPropertiesPanel,
  DraftDesignProperty,
} from '../DesignPropertiesPanel';
import {
  useActiveLayout,
  useDesignStudio,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { LayoutsPanel } from '../LayoutsPanel';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'layouts' | 'properties';

/**
 * Renders the studio's left panel: the design's layouts and the
 * properties of database designs.
 */
export const DesignStudioLeftPanel: React.FC = () => {
  const { t } = useTranslation();
  const studio = useDesignStudio();
  const activeLayout = useActiveLayout();
  // Kept in the view's transient state so the panel opens on the
  // tab it was left on when the studio remounts
  const [activePanel, setActivePanel] = useTransientState<ActivePanel>(
    'left-panel-tab',
    'layouts',
  );
  const [draftProperties, setDraftProperties] = useState<DraftDesignProperty[]>(
    [],
  );
  const designProperties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  const designType = useDesignStudioStore((state) => state.design?.type);

  // Only database designs carry properties to edit
  const hasProperties = designType === 'database';

  function handlePanelChange(value: string) {
    setActivePanel(value as ActivePanel);
  }

  // Close the open layout, returning the layouts tab to its list
  function handleClickBack() {
    studio.setActiveLayout(null);
  }

  // The back button navigates within the panel: it appears while a
  // layout is open on the layouts tab
  const showBack = activePanel === 'layouts' && Boolean(activeLayout);

  // Stage a new property from the chosen template, persisted only
  // once its editor is saved
  function handleAddProperty(template: PropertySchemaTemplate) {
    const draftProperty = {
      ...template,
      name: i18n.t(template.name),
      placeholder: generatePropertyPlaceholder(template.type),
      id: Date.now(),
    } as DraftDesignProperty;

    setDraftProperties((currentDrafts) => [...currentDrafts, draftProperty]);
  }

  // Drop a draft once it has been saved or cancelled
  function removeDraftProperty(id: number) {
    setDraftProperties((currentDrafts) =>
      currentDrafts.filter((draft) => draft.id !== id),
    );
  }

  // The add-property action, offered only while the properties
  // tab is active. A spacer holds its place otherwise, so the
  // centred tabs do not shift as the action comes and goes.
  const actions =
    activePanel === 'properties'
      ? [
          <PropertyTypeSelectionMenu
            key="add-property"
            existingProperties={[...designProperties, ...draftProperties]}
            onSelect={handleAddProperty}
          >
            <IconButton
              label="designs.properties.actions.add"
              icon="plus"
              color="neutral"
            />
          </PropertyTypeSelectionMenu>,
        ]
      : [<IconButtonSpacer key="spacer" size="md" />];

  return (
    <Tabs
      className="designs-studio-left-panel"
      value={activePanel}
      onValueChange={handlePanelChange}
    >
      <PanelView
        breadcrumbs={[]}
        actions={actions}
        header={
          <div className="designs-panel-tabs">
            {showBack ? (
              <IconButton
                icon="arrow-left"
                label="designsStudio.layouts.backToLayouts"
                tooltip={{ title: 'designsStudio.layouts.backToLayouts' }}
                color="neutral"
                onClick={handleClickBack}
              />
            ) : (
              <IconButtonSpacer size="md" />
            )}
            <Spacer />
            <TabsList>
              {hasProperties && (
                <TabsTab value="properties" size="sm">
                  {t('design-studio.labels.properties')}
                </TabsTab>
              )}
              <TabsTab value="layouts" size="sm">
                {t('design-studio.labels.layouts')}
              </TabsTab>
            </TabsList>
            <Spacer />
          </div>
        }
      >
        {hasProperties && (
          <TabsPanel value="properties">
            <DesignPropertiesPanel
              draftProperties={draftProperties}
              onSaveDraft={removeDraftProperty}
              onCancelDraft={removeDraftProperty}
            />
          </TabsPanel>
        )}

        <TabsPanel value="layouts">
          <LayoutsPanel />
        </TabsPanel>
      </PanelView>
    </Tabs>
  );
};
