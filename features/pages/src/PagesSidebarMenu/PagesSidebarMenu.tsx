import { Events } from '@minddrop/events';
import { Pages } from '@minddrop/pages';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuGroup,
  MenuItem,
  MenuLabel,
} from '@minddrop/ui-primitives';
import {
  OpenNewPageDialogEvent,
  OpenPageViewEvent,
  OpenPageViewEventData,
} from '../events';

/**
 * Renders the collapsible pages section in the app sidebar.
 */
export const PagesSidebarMenu: React.FC = () => {
  const pages = Pages.useAll();

  function handleAddPage(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch(OpenNewPageDialogEvent);
  }

  function handleOpenPageView(pageId: string) {
    Events.dispatch<OpenPageViewEventData>(OpenPageViewEvent, { pageId });
  }

  return (
    <div className="pages-sidebar-menu">
      <MenuGroup showLabelActionsOnHover>
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <MenuLabel
                button
                label="pages.labels.pages"
                style={{ marginBottom: 1 }}
                actions={
                  <Button
                    size="sm"
                    label="pages.actions.new"
                    variant="subtle"
                    color="primary"
                    startIcon="plus"
                    onClick={handleAddPage}
                  />
                }
              />
            }
          />
          <CollapsibleContent>
            <MenuGroup>
              {pages.map((page) => (
                <MenuItem
                  muted
                  icon="file"
                  key={page.id}
                  onClick={() => handleOpenPageView(page.id)}
                >
                  {page.name}
                </MenuItem>
              ))}
            </MenuGroup>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </div>
  );
};
