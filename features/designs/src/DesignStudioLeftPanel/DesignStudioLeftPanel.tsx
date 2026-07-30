import { useCallback, useEffect, useRef, useState } from 'react';
import { Design, Designs, Layout, LayoutType } from '@minddrop/designs';
import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  ScrollArea,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, addLayout } from '../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import { NewLayoutMenu } from '../NewLayoutMenu';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'designs' | 'elements' | 'layers';

const LAYOUT_TYPES = ['card', 'list', 'page'] as const;

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

const layoutTypeIconMap: Record<string, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

export interface DesignStudioLeftPanelProps {
  /**
   * Callback fired when the back button is clicked.
   */
  onClickBack?: () => void;

  /**
   * When set, a new design of this type is created and
   * opened on mount.
   */
  newLayoutType?: LayoutType;
}

export const DesignStudioLeftPanel: React.FC<DesignStudioLeftPanelProps> = ({
  onClickBack,
  newLayoutType,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>(
    newLayoutType ? 'elements' : 'designs',
  );
  const designs = Designs.useAll();
  const activeLayoutId = DesignStudioStore((state) => state.activeLayoutId);
  const hasCreatedNewDesign = useRef(false);

  // Open the layout's parent design in the studio (if not already
  // open) and make the layout active
  const handleSelectLayout = useCallback((design: Design, layout: Layout) => {
    const store = DesignStudioStore.getState();

    if (store.design?.id !== design.id) {
      store.initialize(design);
    }

    store.setActiveLayout(layout.id);
  }, []);

  // Create a new design with a starter layout of the chosen type
  // and open it in the studio
  const handleCreateDesign = useCallback(async (type: LayoutType) => {
    const design = await Designs.create();

    DesignStudioStore.getState().initialize(design);
    await addLayout(design.id, type);
    setActivePanel('elements');
  }, []);

  // Create and open a new design on mount when newLayoutType is set
  useEffect(() => {
    if (!newLayoutType || hasCreatedNewDesign.current) {
      return;
    }

    hasCreatedNewDesign.current = true;

    handleCreateDesign(newLayoutType);
  }, [newLayoutType, handleCreateDesign]);

  return (
    <Tabs
      className="design-studio-left-panel-content"
      value={activePanel}
      onValueChange={(value) => setActivePanel(value as ActivePanel)}
    >
      <div className="panel-tabs">
        {onClickBack && (
          <IconButton
            icon="arrow-left"
            label="designStudio.exit"
            tooltip={{ title: 'designStudio.exit' }}
            color="neutral"
            onClick={onClickBack}
          />
        )}
        <Spacer />
        <TabsList>
          <TabsTab value="designs" size="sm">
            {i18n.t('design-studio.labels.designs')}
          </TabsTab>
          <TabsTab value="elements" size="sm" disabled={!activeLayoutId}>
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
          <TabsTab value="layers" size="sm" disabled={!activeLayoutId}>
            {i18n.t('design-studio.labels.layers')}
          </TabsTab>
        </TabsList>
        <Spacer />
        <NewLayoutMenu onSelectType={handleCreateDesign} />
      </div>

      <TabsPanel value="designs">
        <ScrollArea>
          <div className="designs-list">
            {LAYOUT_TYPES.map((type) => {
              // Collect layouts of this type across all designs,
              // paired with their parent design
              const typeLayouts = designs.flatMap((design) =>
                design.layouts
                  .filter((layout) => layout.type === type)
                  .map((layout) => ({ design, layout })),
              );

              if (!typeLayouts.length) {
                return null;
              }

              return (
                <MenuGroup key={type}>
                  <MenuLabel label={layoutTypeI18nKey(type, 'name')} />
                  {typeLayouts.map(({ design, layout }) => (
                    <MenuItem
                      key={layout.id}
                      icon={layoutTypeIconMap[layout.type]}
                      active={layout.id === activeLayoutId}
                      muted
                      onClick={() => handleSelectLayout(design, layout)}
                    >
                      {layout.name}
                    </MenuItem>
                  ))}
                </MenuGroup>
              );
            })}
          </div>
        </ScrollArea>
      </TabsPanel>

      <TabsPanel value="elements">
        <ElementsPalette />
      </TabsPanel>

      <TabsPanel value="layers">
        <ElementsTree />
      </TabsPanel>
    </Tabs>
  );
};
