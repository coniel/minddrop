import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Design,
  DesignType,
  Designs,
  defaultDesignIds,
} from '@minddrop/designs';
import { NewDesignMenu } from '@minddrop/feature-designs';
import { i18n } from '@minddrop/i18n';
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
import { DesignStudioStore } from '../../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'designs' | 'elements' | 'layers';

const DESIGN_TYPES = ['card', 'list', 'page'] as const;

const designTypeIconMap: Record<string, string> = {
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
  newDesignType?: DesignType;
}

export const DesignStudioLeftPanel: React.FC<DesignStudioLeftPanelProps> = ({
  onClickBack,
  newDesignType,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>(
    newDesignType ? 'elements' : 'designs',
  );
  const designs = Designs.useAll();
  const activeDesignId = DesignStudioStore((state) => state.design?.id);
  const hasCreatedNewDesign = useRef(false);

  const handleSelectDesign = useCallback((design: Design) => {
    DesignStudioStore.getState().initialize(design);
  }, []);

  // Create and open a new design on mount when newDesignType is set
  useEffect(() => {
    if (!newDesignType || hasCreatedNewDesign.current) {
      return;
    }

    hasCreatedNewDesign.current = true;

    async function createNewDesign() {
      const design = await Designs.create(newDesignType!);

      handleSelectDesign(design);
      setActivePanel('elements');
    }

    createNewDesign();
  }, [newDesignType, handleSelectDesign]);

  // Create a new design from the NewDesignMenu
  async function handleCreateDesign(type: DesignType) {
    const design = await Designs.create(type);

    handleSelectDesign(design);
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
            tooltipTitle="designStudio.exit"
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
        <NewDesignMenu onSelectType={handleCreateDesign} />
      </div>

      <TabsPanel value="designs">
        <ScrollArea>
          <div className="designs-list">
            {DESIGN_TYPES.map((type) => {
              const typeDesigns = designs.filter(
                (design) =>
                  design.type === type && !defaultDesignIds.includes(design.id),
              );

              if (!typeDesigns.length) {
                return null;
              }

              return (
                <MenuGroup key={type}>
                  <MenuLabel label={`designs.${type}.name`} />
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
