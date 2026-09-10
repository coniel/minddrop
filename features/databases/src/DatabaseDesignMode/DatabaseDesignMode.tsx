import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Databases } from '@minddrop/databases';
import { DesignType, Designs } from '@minddrop/designs-next';
import { DesignEditor } from '@minddrop/ui-designs-next';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Group,
  IconButton,
  Tabs,
  TabsList,
  TabsTab,
  Text,
  useTransientState,
} from '@minddrop/ui-primitives';
import { orderByCreated, reconcileIdOrder } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { AddDesignMenu } from './AddDesignMenu';
import { DatabaseDesignMenu } from './DatabaseDesignMenu';
import './DatabaseDesignMode.css';

export interface DatabaseDesignModeProps {
  /**
   * The ID of the database whose designs to edit.
   */
  databaseId: string;
}

/**
 * Renders a database's design mode: a tab strip of the database's
 * designs with a menu for adding designs, and the design editor on
 * the active design.
 */
export const DatabaseDesignMode: React.FC<DatabaseDesignModeProps> = ({
  databaseId,
}) => {
  const database = Databases.use(databaseId);
  const unsortedDesigns = Designs.useAll(databaseId);
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();

  // Sort designs according to the config's design ID list, placing
  // designs missing from it after the ordered ones by creation date.
  const designs = useMemo(
    () =>
      reconcileIdOrder(
        database?.designs ?? [],
        unsortedDesigns,
        orderByCreated,
      ),
    [unsortedDesigns, database?.designs],
  );

  // Per-tab active design selection
  const [tabActiveDesignId, setTabActiveDesignId] = useTransientState<
    string | null
  >('activeDesignId', null);

  // Track which design's menu is open and its anchor element, and
  // the newly added design whose menu opens once its tab renders.
  const tabsRef = useRef<HTMLDivElement>(null);
  const [menuDesignId, setMenuDesignId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);
  const [pendingMenuDesignId, setPendingMenuDesignId] = useState<string | null>(
    null,
  );

  // Whether the active design's settings dropdown is open
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Resolve the active design, falling back to the first design
  const activeDesignId = tabActiveDesignId ?? designs[0]?.id;
  const activeDesign =
    designs.find((design) => design.id === activeDesignId) ??
    designs[0] ??
    null;
  const menuDesign = designs.find((design) => design.id === menuDesignId);

  // Update this tab's active design
  const setActiveDesignId = useCallback(
    (designId: string | undefined) => {
      setTabActiveDesignId(designId ?? null);
    },
    [setTabActiveDesignId],
  );

  // Fall back to the first design when the active one is removed
  useEffect(() => {
    if (designs.length === 0) {
      return;
    }

    if (
      activeDesignId &&
      designs.some((design) => design.id === activeDesignId)
    ) {
      return;
    }

    setActiveDesignId(designs[0]?.id);
  }, [designs, activeDesignId, setActiveDesignId]);

  // Label the tab with the active design, without recording a
  // navigation: the design mode subview itself is what was navigated
  // to, and keeps its title in the breadcrumb trail.
  const activeDesignName = activeDesign?.name;

  useEffect(() => {
    if (subview && subview.label !== activeDesignName) {
      setSubview({ ...subview, label: activeDesignName }, { replace: true });
    }
  }, [subview, activeDesignName, setSubview]);

  // Open the menu of a newly added design once its tab has rendered,
  // for naming it.
  useEffect(() => {
    if (!pendingMenuDesignId) {
      return;
    }

    const tab = tabsRef.current?.querySelector(
      `[data-design-id="${pendingMenuDesignId}"]`,
    );

    if (tab) {
      setMenuAnchor(tab);
      setMenuDesignId(pendingMenuDesignId);
      setPendingMenuDesignId(null);
    }
  }, [pendingMenuDesignId, designs]);

  // Create a design of the selected type, make it active and open
  // its menu to name it.
  async function handleAddDesign(type: DesignType) {
    if (!database) {
      return;
    }

    const design = await Designs.create({ type, owner: database.id });

    setActiveDesignId(design.id);
    setPendingMenuDesignId(design.id);
  }

  function handleCloseMenu() {
    setMenuDesignId(null);
    setMenuAnchor(null);
  }

  function handleCloseSettings() {
    setSettingsOpen(false);
  }

  // Persist the tab order to the database
  function handleSort(newOrder: string[]) {
    Databases.update(databaseId, { designs: newOrder });
  }

  // Open a tab's menu when its active tab is clicked
  function handleTabClick(
    event: React.MouseEvent<HTMLElement>,
    designId: string,
    isActive: boolean,
  ) {
    // Only the active tab's click opens the menu
    if (!isActive) {
      return;
    }

    setMenuAnchor(event.currentTarget);
    setMenuDesignId(designId);
  }

  // Open a tab's menu on right click
  function handleTabContextMenu(
    event: React.MouseEvent<HTMLElement>,
    designId: string,
  ) {
    // Suppress the native context menu
    event.preventDefault();

    setMenuAnchor(event.currentTarget);
    setMenuDesignId(designId);
  }

  function handleMenuOpenChange(open: boolean) {
    // Clear the menu state when the menu closes
    if (!open) {
      handleCloseMenu();
    }
  }

  if (!database) {
    return null;
  }

  return (
    <div className="database-design-mode">
      <div ref={tabsRef} className="database-view-switcher">
        {activeDesign && (
          <>
            <Tabs value={activeDesign.id} onValueChange={setActiveDesignId}>
              <SortableList
                as={TabsList}
                items={designs.map((design) => design.id)}
                direction="horizontal"
                gap={1}
                onSort={handleSort}
                renderItem={(id, { ref, handleProps, style, className }) => {
                  const design = designs.find((design) => design.id === id);

                  if (!design) {
                    return null;
                  }

                  const isActive = design.id === activeDesign.id;

                  return (
                    <TabsTab
                      key={design.id}
                      ref={ref}
                      value={design.id}
                      data-design-id={design.id}
                      startIcon={Designs.constants.TypeIcons[design.type]}
                      className={className}
                      style={style}
                      onClick={(event) =>
                        handleTabClick(event, design.id, isActive)
                      }
                      onContextMenu={(event) =>
                        handleTabContextMenu(event, design.id)
                      }
                      {...handleProps}
                    >
                      {design.name}
                    </TabsTab>
                  );
                }}
              />
            </Tabs>

            {/* Design menu - opens when clicking the active tab */}
            <ContextMenuRoot
              open={menuDesignId !== null}
              onOpenChange={handleMenuOpenChange}
            >
              <ContextMenuPortal>
                <ContextMenuPositioner
                  anchor={menuAnchor}
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <ContextMenuContent>
                    {menuDesign && (
                      <DatabaseDesignMenu
                        database={database}
                        design={menuDesign}
                        onDuplicated={setActiveDesignId}
                        onClose={handleCloseMenu}
                      />
                    )}
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenuRoot>
          </>
        )}

        {/* Add design dropdown */}
        <AddDesignMenu size="sm" color="muted" onSelectType={handleAddDesign} />

        {/* Active design settings dropdown, with the tab menu's content */}
        {activeDesign && (
          <Group gap={2} className="database-view-switcher-actions">
            <DropdownMenuRoot
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            >
              <DropdownMenuTrigger>
                <IconButton
                  size="sm"
                  label="databases.design.actions.settings"
                  tooltip={{ title: 'databases.design.actions.settings' }}
                  icon="settings-2"
                />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuPositioner side="bottom" align="end">
                  <DropdownMenuContent>
                    <DatabaseDesignMenu
                      database={database}
                      design={activeDesign}
                      onDuplicated={setActiveDesignId}
                      onClose={handleCloseSettings}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </Group>
        )}
      </div>

      {/* The editor on the active design */}
      <div className="database-design-mode-editor">
        {activeDesign ? (
          <DesignEditor
            key={activeDesign.id}
            designId={activeDesign.id}
            properties={database?.properties}
          />
        ) : (
          <Text
            className="database-design-mode-empty"
            size="sm"
            color="subtle"
            text="databases.design.empty"
          />
        )}
      </div>
    </div>
  );
};
