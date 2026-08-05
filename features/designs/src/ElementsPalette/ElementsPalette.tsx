import { DataViewTypes } from '@minddrop/data-views';
import { ELEMENT_GROUPS } from '@minddrop/designs';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import { ElementsPaletteItem } from './ElementsPaletteItem';
import { ViewTypePaletteItem } from './ViewTypePaletteItem';
import './ElementsPalette.css';

export interface ElementsPaletteProps {
  /**
   * When provided, only these element types are shown.
   */
  elementTypes?: string[];

  /**
   * Whether to show the views group.
   * @default true
   */
  showViews?: boolean;
}

/**
 * Renders the draggable element palette, grouped by element
 * category, followed by the registered view types.
 */
export const ElementsPalette: React.FC<ElementsPaletteProps> = ({
  elementTypes,
  showViews = true,
}) => {
  const viewTypes = DataViewTypes.useAll();

  // Filter each group's types to the allowed set, dropping
  // groups left empty
  const groups = ELEMENT_GROUPS.map((group) => ({
    ...group,
    types: elementTypes
      ? group.types.filter((type) => elementTypes.includes(type))
      : group.types,
  })).filter((group) => group.types.length > 0);

  return (
    <div className="elements-palette">
      {groups.map((group) => (
        <MenuGroup key={group.label}>
          <MenuLabel label={group.label} />
          {group.types.map((type) => (
            <ElementsPaletteItem key={type} type={type} />
          ))}
        </MenuGroup>
      ))}

      {showViews && viewTypes.length > 0 && (
        <MenuGroup>
          <MenuLabel label="design-studio.elements.group.views" />
          {viewTypes.map((viewType) => (
            <ViewTypePaletteItem key={viewType.type} viewType={viewType} />
          ))}
        </MenuGroup>
      )}
    </div>
  );
};
