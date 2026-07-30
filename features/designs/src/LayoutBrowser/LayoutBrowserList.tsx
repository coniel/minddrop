import { useCallback, useMemo, useState } from 'react';
import {
  Layout,
  LayoutType,
  Layouts,
  defaultLayoutIds,
} from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Icon,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  ScrollArea,
  TextInput,
} from '@minddrop/ui-primitives';
import { NewLayoutMenu } from '../NewLayoutMenu';
import { OpenDesignStudioEvent, OpenDesignStudioEventData } from '../events';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

const DESIGN_TYPES: LayoutType[] = ['card', 'list', 'page'];

const designTypeIconMap: Record<LayoutType, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

export interface LayoutBrowserListProps {
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
  onSelectDesign: (design: Layout) => void;

  /**
   * Callback fired to close the overlay.
   */
  onClose: () => void;
}

export const LayoutBrowserList: React.FC<LayoutBrowserListProps> = ({
  selectedDesignId,
  onSelectDesign,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const designs = Layouts.useAll();

  // Filter out default designs and apply search filter
  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      // Exclude default designs
      if (defaultLayoutIds.includes(design.id)) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        return design.name.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    });
  }, [designs, searchTerm]);

  // Open the design studio to create a new design of the given type
  const handleCreateDesign = useCallback(
    (type: LayoutType) => {
      // Close the browser overlay
      onClose();

      // Open the design studio with a new design
      Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
        newLayoutType: type,
      });
    },
    [onClose],
  );

  return (
    <div className="layout-browser-list">
      {/* Header with back button, search, and new design button */}
      <div className="layout-browser-header">
        <IconButton
          icon="chevron-left"
          label="actions.back"
          color="neutral"
          onClick={onClose}
        />
        <TextInput
          variant="subtle"
          size="md"
          placeholder="designs.layout-property-mapping.browser.search"
          leading={<Icon name="search" color="muted" />}
          value={searchTerm}
          onValueChange={setSearchTerm}
          clearable
        />
        <NewLayoutMenu onSelectType={handleCreateDesign} />
      </div>

      {/* Scrollable design list grouped by type */}
      <ScrollArea>
        <div className="layout-browser-designs">
          {DESIGN_TYPES.map((type) => {
            const typeDesigns = filteredDesigns.filter(
              (design) => design.type === type,
            );

            if (!typeDesigns.length) {
              return null;
            }

            return (
              <MenuGroup key={type}>
                <MenuLabel label={layoutTypeI18nKey(type, 'name')} />
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
