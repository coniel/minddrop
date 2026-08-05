import { useMemo, useState } from 'react';
import { DataViewTypes, DataViews } from '@minddrop/data-views';
import {
  MenuGroup,
  MenuLabel,
  ScrollArea,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { StaticViewTypePaletteItem } from './StaticViewTypePaletteItem';
import { ViewPaletteItem } from './ViewPaletteItem';
import './ViewsPanel.css';

/**
 * Renders the layout editor's views panel: draggable view type
 * items for creating new views, above a searchable list of
 * existing views.
 */
export const ViewsPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const viewTypes = DataViewTypes.useAll();
  const views = DataViews.useAll();

  // Only real views are reusable
  const realViews = useMemo(
    () => views.filter((view) => !view.virtual),
    [views],
  );

  // Views whose name matches the search query, case-insensitively
  const filteredViews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return realViews;
    }

    return realViews.filter((view) => view.name.toLowerCase().includes(query));
  }, [realViews, searchQuery]);

  return (
    <ScrollArea className="views-panel">
      {/* View types for creating new views */}
      <MenuGroup>
        <MenuLabel label="design-studio.views.new" />
        {viewTypes.map((viewType) => (
          <StaticViewTypePaletteItem key={viewType.type} viewType={viewType} />
        ))}
      </MenuGroup>

      {/* Existing views to reuse */}
      <MenuGroup>
        <MenuLabel label="design-studio.views.existing" />
        <TextInput
          clearable
          variant="subtle"
          size="md"
          placeholder="design-studio.views.search.placeholder"
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        {/* No views exist yet */}
        {!realViews.length && (
          <Text
            paragraph
            size="sm"
            color="muted"
            text="design-studio.views.empty"
          />
        )}
        {/* The search query matched no views */}
        {realViews.length > 0 && !filteredViews.length && (
          <Text
            paragraph
            size="sm"
            color="muted"
            text="design-studio.views.noMatches"
          />
        )}
        {filteredViews.map((view) => (
          <ViewPaletteItem key={view.id} view={view} />
        ))}
      </MenuGroup>
    </ScrollArea>
  );
};
