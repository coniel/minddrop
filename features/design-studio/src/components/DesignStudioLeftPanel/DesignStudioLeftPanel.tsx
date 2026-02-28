import { useCallback, useState } from 'react';
import {
  Design,
  DesignType,
  Designs,
  defaultDesignIds,
} from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
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
  onClickBack?: () => void;
}

export const DesignStudioLeftPanel: React.FC<DesignStudioLeftPanelProps> = ({
  onClickBack,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('designs');
  const designs = Designs.useAll();
  const activeDesignId = DesignStudioStore((state) => state.design?.id);

  const handleSelectDesign = useCallback((design: Design) => {
    DesignStudioStore.getState().initialize(design);
  }, []);

  const handleCreateDesign = async (type: DesignType) => {
    const design = await Designs.create(type);
    handleSelectDesign(design);
    setActivePanel('elements');
  };

  return (
    <Tabs
      className="design-studio-left-panel-content"
      value={activePanel}
      onValueChange={(value) => setActivePanel(value as ActivePanel)}
    >
      <div className="panel-tabs">
        {onClickBack && (
          <IconButton
            icon="chevron-left"
            label="actions.back"
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton
              icon="plus"
              label="design-studio.labels.new"
              color="neutral"
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="bottom" align="start">
              <DropdownMenuContent
                minWidth={300}
                className="property-type-selection-menu"
              >
                <MenuGroup padded>
                  <DropdownMenuItem
                    muted
                    icon="layout"
                    label="designs.page.new"
                    tooltipDescription="designs.page.description"
                    onClick={() => handleCreateDesign('page')}
                  />
                  <DropdownMenuItem
                    muted
                    icon="layout-grid"
                    label="designs.card.new"
                    tooltipDescription="designs.card.description"
                    onClick={() => handleCreateDesign('card')}
                  />
                  <DropdownMenuItem
                    muted
                    icon="layout-list"
                    label="designs.list.new"
                    tooltipDescription="designs.list.description"
                    onClick={() => handleCreateDesign('list')}
                  />
                </MenuGroup>
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenu>
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
