import { useCallback, useEffect, useRef, useState } from 'react';
import { Design, Designs, LayoutType } from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import {
  IconButton,
  MenuItem,
  ScrollArea,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { AddLayoutMenu } from '../AddLayoutMenu';
import { DesignStudioStore, addLayout } from '../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import { centerViewOnLayout, resetView } from '../viewportActions';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'designs' | 'elements' | 'layouts';

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
  const openDesignId = DesignStudioStore((state) => state.design?.id ?? null);
  const hasCreatedNewDesign = useRef(false);

  // Open the design in the studio (if not already open) with all
  // of its layouts fitted into view
  const handleSelectDesign = useCallback((design: Design) => {
    const store = DesignStudioStore.getState();

    if (store.design?.id !== design.id) {
      store.initialize(design);
      resetView();
    }
  }, []);

  // Create a new design with a starter layout of the chosen type
  // and open it in the studio
  const handleCreateDesign = useCallback(async (type: LayoutType) => {
    const design = await Designs.create();

    DesignStudioStore.getState().initialize(design);

    const layout = await addLayout(design.id, type);

    centerViewOnLayout(layout.id);
    setActivePanel('elements');
  }, []);

  // Create a new empty design, open it in the studio and switch
  // to the layouts tab so layouts can be added
  const handleCreateEmptyDesign = useCallback(async () => {
    const design = await Designs.create();

    DesignStudioStore.getState().initialize(design);
    setActivePanel('layouts');
  }, []);

  // Create and open a new design on mount when newLayoutType is set
  useEffect(() => {
    if (!newLayoutType || hasCreatedNewDesign.current) {
      return;
    }

    hasCreatedNewDesign.current = true;

    handleCreateDesign(newLayoutType);
  }, [newLayoutType, handleCreateDesign]);

  // Open the first design by default when none is open
  useEffect(() => {
    if (newLayoutType || openDesignId || !designs.length) {
      return;
    }

    handleSelectDesign(designs[0]);
  }, [designs, newLayoutType, openDesignId, handleSelectDesign]);

  // Leave the layouts tab when no design is open
  useEffect(() => {
    if (activePanel === 'layouts' && !openDesignId) {
      setActivePanel('designs');
    }
  }, [activePanel, openDesignId]);

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
          <TabsTab value="elements" size="sm">
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
          <TabsTab value="layouts" size="sm" disabled={!openDesignId}>
            {i18n.t('design-studio.labels.layouts')}
          </TabsTab>
        </TabsList>
        <Spacer />
        {/* On the designs tab the + button creates a design;
            inside a design it adds layouts */}
        {activePanel === 'designs' ? (
          <IconButton
            size="sm"
            icon="plus"
            label="designs.new"
            tooltip={{ title: 'designs.new' }}
            onClick={handleCreateEmptyDesign}
          />
        ) : (
          <AddLayoutMenu />
        )}
      </div>

      <TabsPanel value="designs">
        <ScrollArea>
          <div className="designs-list">
            {designs.map((design) => (
              <MenuItem
                key={design.id}
                icon="palette"
                active={design.id === openDesignId}
                muted
                onClick={() => handleSelectDesign(design)}
              >
                {design.name}
              </MenuItem>
            ))}
          </div>
        </ScrollArea>
      </TabsPanel>

      <TabsPanel value="elements">
        <ElementsPalette />
      </TabsPanel>

      <TabsPanel value="layouts">
        <ElementsTree />
      </TabsPanel>
    </Tabs>
  );
};
