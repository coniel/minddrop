import { useState } from 'react';
import {
  DesignElementConfig,
  DesignElementConfigs,
  DesignElementGroup,
  Designs,
} from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { SidebarGroup } from '@minddrop/ui-components';
import { Icon, MenuGroup, Text, TextInput } from '@minddrop/ui-primitives';
import { fuzzySearchBy } from '@minddrop/utils';
import { ElementsPaletteItem } from '../ElementsPaletteItem';
import './ElementsPalette.css';

const groupKey = createI18nKeyBuilder('designsNext.elements.groups.');

/**
 * Renders the searchable palette of insertable elements, grouped in
 * sidebar groups. A search term replaces the groups with a flat list
 * ranked by match. Elements drag onto the design.
 */
export const ElementsPalette: React.FC = () => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const configs = DesignElementConfigs.useAll();

  const searching = query.trim().length > 0;

  // The configs matching the search term, best matches first
  const matches = searching
    ? fuzzySearchBy(configs, query, (config) => t(config.label))
    : [];

  function handleClear() {
    setQuery('');
  }

  // Renders the item dragging an element type
  function renderItem(config: DesignElementConfig) {
    return <ElementsPaletteItem key={config.type} config={config} />;
  }

  // Renders a group's items, omitting empty groups
  function renderGroup(group: DesignElementGroup, index: number) {
    const members = configs.filter((config) => config.group === group);

    if (members.length === 0) {
      return null;
    }

    return (
      <SidebarGroup
        key={group}
        label={groupKey(group)}
        marginTop={index === 0 ? 'medium' : undefined}
      >
        {members.map(renderItem)}
      </SidebarGroup>
    );
  }

  return (
    <div className="designs-next-elements-palette">
      <TextInput
        className="designs-next-elements-palette-search"
        variant="subtle"
        size="md"
        placeholder="designsNext.palette.search"
        leading={<Icon name="search" />}
        value={query}
        onValueChange={setQuery}
        clearable
        onClear={handleClear}
        unassisted
      />
      {searching ? (
        <MenuGroup marginTop="medium">
          {matches.length > 0 ? (
            matches.map(renderItem)
          ) : (
            <Text
              block
              size="sm"
              color="muted"
              className="designs-next-elements-palette-empty"
              text="designsNext.palette.empty"
            />
          )}
        </MenuGroup>
      ) : (
        Designs.constants.ElementGroups.map(renderGroup)
      )}
    </div>
  );
};
