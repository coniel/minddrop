import { useCallback, useState } from 'react';
import { Design, DesignType, Designs, defaultDesignIds } from '@minddrop/designs';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  MenuGroup,
  MenuLabel,
  ScrollArea,
  Spacer,
} from '@minddrop/ui-primitives';
import { DesignStudioStore } from '../../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'designs' | 'elements';

const DESIGN_TYPES = ['card', 'list', 'page'] as const;

export const DesignStudioLeftPanel: React.FC = () => {
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
    <div className="design-studio-left-panel">
      <div className="panel-tabs">
        <Button
          label="design-studio.labels.designs"
          variant={activePanel === 'designs' ? 'subtle' : 'ghost'}
          onClick={() => setActivePanel('designs')}
        />
        <Button
          label="design-studio.labels.elements"
          variant={activePanel === 'elements' ? 'subtle' : 'ghost'}
          onClick={() => setActivePanel('elements')}
        />
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

      {activePanel === 'designs' && (
        <ScrollArea>
          <div className="designs-list">
            {DESIGN_TYPES.map((type) => {
              const typeDesigns = designs.filter(
                (design) => design.type === type && !defaultDesignIds.includes(design.id),
              );

              if (!typeDesigns.length) {
                return null;
              }

              return (
                <div key={type} className="design-type-group">
                  <MenuLabel label={`designs.${type}.name`} />
                  {typeDesigns.map((design) => (
                    <div
                      key={design.id}
                      className={`design-item${design.id === activeDesignId ? ' active' : ''}`}
                      onClick={() => handleSelectDesign(design)}
                    >
                      {design.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {activePanel === 'elements' && <ElementsPalette />}
    </div>
  );
};
