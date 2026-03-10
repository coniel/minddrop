import { ELEMENT_GROUPS } from '@minddrop/designs';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import { ViewTypes } from '@minddrop/views';
import { ElementsPaletteItem } from './ElementsPaletteItem';
import { ViewTypePaletteItem } from './ViewTypePaletteItem';
import './ElementsPalette.css';

export const ElementsPalette: React.FC = () => {
  const viewTypes = ViewTypes.useAll();

  return (
    <div className="elements-palette">
      {ELEMENT_GROUPS.map((group) => (
        <MenuGroup key={group.label}>
          <MenuLabel label={group.label} />
          {group.types.map((type) => (
            <ElementsPaletteItem key={type} type={type} />
          ))}
        </MenuGroup>
      ))}

      {viewTypes.length > 0 && (
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
