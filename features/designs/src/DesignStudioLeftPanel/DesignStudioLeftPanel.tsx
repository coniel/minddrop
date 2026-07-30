import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Designs,
  Layout,
  LayoutType,
  Layouts,
  defaultLayoutIds,
} from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
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
import { DesignStudioStore } from '../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import { NewLayoutMenu } from '../NewLayoutMenu';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'designs' | 'elements' | 'layers';

const DESIGN_TYPES = ['card', 'list', 'page'] as const;

const designTypeIconMap: Record<string, UiIconName> = {
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
  const designs = Layouts.useAll();
  const activeDesignId = DesignStudioStore((state) => state.design?.id);
  const hasCreatedNewDesign = useRef(false);

  const handleSelectDesign = useCallback((design: Layout) => {
    DesignStudioStore.getState().initialize(design);
  }, []);

  // Create and open a new design on mount when newLayoutType is set
  useEffect(() => {
    if (!newLayoutType || hasCreatedNewDesign.current) {
      return;
    }

    hasCreatedNewDesign.current = true;

    async function createNewDesign() {
      const design = await Designs.create();
      const layout = await Layouts.create(design.id, newLayoutType!);

      handleSelectDesign(layout);
      setActivePanel('elements');
    }

    createNewDesign();
  }, [newLayoutType, handleSelectDesign]);

  // Create a new design with a starter layout of the chosen type
  async function handleCreateDesign(type: LayoutType) {
    const design = await Designs.create();
    const layout = await Layouts.create(design.id, type);

    handleSelectDesign(layout);
    setActivePanel('elements');
  }

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
          <TabsTab value="elements" size="sm" disabled={!activeDesignId}>
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
          <TabsTab value="layers" size="sm" disabled={!activeDesignId}>
            {i18n.t('design-studio.labels.layers')}
          </TabsTab>
        </TabsList>
        <Spacer />
        <NewLayoutMenu onSelectType={handleCreateDesign} />
      </div>

      <TabsPanel value="designs">
        <ScrollArea>
          <div className="designs-list">
            {DESIGN_TYPES.map((type) => {
              const typeDesigns = designs.filter(
                (design) =>
                  design.type === type && !defaultLayoutIds.includes(design.id),
              );

              if (!typeDesigns.length) {
                return null;
              }

              return (
                <MenuGroup key={type}>
                  <MenuLabel label={`layouts.${type}.name`} />
                  {typeDesigns.map((design) => (
                    <MenuItem
                      key={design.id}
                      icon={designTypeIconMap[design.type]}
                      active={design.id === activeDesignId}
                      muted
                      onClick={() => handleSelectDesign(design)}
                    >
                      {design.name}
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
