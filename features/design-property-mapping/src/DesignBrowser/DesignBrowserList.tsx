import { useCallback, useMemo, useState } from 'react';
import {
  Design,
  DesignType,
  Designs,
  defaultDesignIds,
} from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-design-studio';
import { UiIconName } from '@minddrop/icons';
import {
  DropdownMenu,
  DropdownMenuItem,
  Icon,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  ScrollArea,
  TextInput,
} from '@minddrop/ui-primitives';

const DESIGN_TYPES: DesignType[] = ['card', 'list', 'page'];

const designTypeIconMap: Record<DesignType, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

export interface DesignBrowserListProps {
  /**
   * The ID of the database to browse designs for.
   */
  databaseId: string;

  /**
   * The currently selected design ID.
   */
  selectedDesignId: string | null;

  /**
   * Callback fired when a design is selected.
   */
  onSelectDesign: (design: Design) => void;

  /**
   * Callback fired to close the overlay.
   */
  onClose: () => void;
}

export const DesignBrowserList: React.FC<DesignBrowserListProps> = ({
  databaseId,
  selectedDesignId,
  onSelectDesign,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const designs = Designs.useAll();

  // Filter out default designs and apply search filter
  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      // Exclude default designs
      if (defaultDesignIds.includes(design.id)) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        return design.name.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    });
  }, [designs, searchTerm]);

  // Handle creating a new design of the given type
  const handleCreateDesign = useCallback(
    async (type: DesignType) => {
      // Create a new design of the specified type
      const design = await Designs.create(type);

      // Close the browser overlay
      onClose();

      // Open the design studio with the new design
      Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
        backEvent: '',
        backEventData: {},
      });
    },
    [databaseId, onClose],
  );

  return (
    <div className="design-browser-list">
      {/* Header with search and new design button */}
      <div className="design-browser-header">
        <TextInput
          variant="subtle"
          size="sm"
          placeholder="design-property-mapping.browser.search"
          leading={<Icon name="search" color="muted" />}
          value={searchTerm}
          onValueChange={setSearchTerm}
          clearable
        />
        <DropdownMenu
          trigger={
            <IconButton
              icon="plus"
              label="design-property-mapping.browser.newDesign"
              color="neutral"
            />
          }
          minWidth={300}
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
        </DropdownMenu>
      </div>

      {/* Scrollable design list grouped by type */}
      <ScrollArea>
        <div className="design-browser-designs">
          {DESIGN_TYPES.map((type) => {
            const typeDesigns = filteredDesigns.filter(
              (design) => design.type === type,
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
                    active={design.id === selectedDesignId}
                    muted
                    onClick={() => onSelectDesign(design)}
                  >
                    {design.name}
                  </MenuItem>
                ))}
              </MenuGroup>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
