import { ELEMENT_GROUPS } from '@minddrop/designs';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import { ElementsPaletteItem } from '../ElementsPaletteItem/ElementsPaletteItem';
import './ElementsPalette.css';

export const ElementsPalette: React.FC = () => {
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
    </div>
  );
};
