import { useCallback, useMemo } from 'react';
import { Layouts } from '@minddrop/designs';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { Pages } from '@minddrop/pages';
import { PropertyValue } from '@minddrop/properties';
import {
  ContentIcon,
  Group,
  Heading,
  ScrollArea,
  Text,
} from '@minddrop/ui-primitives';
import './PageView.css';

export interface PageViewProps {
  /**
   * The ID of the page to display.
   */
  pageId: string;
}

/**
 * Renders a page: its icon and name header above the page's layout
 * filled with the page's property values.
 */
export const PageView: React.FC<PageViewProps> = ({ pageId }) => {
  const page = Pages.use(pageId);

  // Element ID to property name bindings of the page layout
  const propertyMap = useMemo(
    () => (page ? Layouts.getPropertyBindings(page.layout) : {}),
    [page],
  );

  const handleUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      // The page cannot be updated once deleted
      if (!page) {
        return;
      }

      Pages.update(pageId, {
        properties: { ...page.properties, [name]: value },
      });
    },
    [pageId, page],
  );

  // The page no longer exists
  if (!page) {
    return (
      <div className="page-view page-view-not-found">
        <Text color="muted" text="pages.view.notFound" />
      </div>
    );
  }

  return (
    <div className="page-view">
      {/* Page icon and name */}
      <Group className="page-view-header" gap={2} align="center">
        <ContentIcon icon={page.icon} />
        <Heading noMargin>{page.name}</Heading>
      </Group>
      {/* The page's layout filled with its property values */}
      <ScrollArea className="page-view-content">
        <LayoutRenderer
          layout={page.layout}
          context="page"
          propertyMap={propertyMap}
          propertyValues={page.properties}
          properties={[]}
          onUpdatePropertyValue={handleUpdatePropertyValue}
        />
      </ScrollArea>
    </div>
  );
};
