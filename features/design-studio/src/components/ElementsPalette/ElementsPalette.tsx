import { MenuGroup, MenuLabel, ScrollArea } from '@minddrop/ui-primitives';
import { ElementsPaletteItem } from '../ElementsPaletteItem/ElementsPaletteItem';
import './ElementsPalette.css';

const ELEMENT_GROUPS = [
  {
    label: 'design-studio.elements.group.content',
    types: ['text', 'formatted-text', 'number'],
  },
  {
    label: 'design-studio.elements.group.media',
    types: ['image'],
  },
  {
    label: 'design-studio.elements.group.layout',
    types: ['container'],
  },
];

export const ElementsPalette: React.FC = () => {
  return (
    <ScrollArea>
      <div className="elements-palette">
        {ELEMENT_GROUPS.map((group) => (
          <MenuGroup key={group.label} padded>
            <MenuLabel label={group.label} />
            {group.types.map((type) => (
              <ElementsPaletteItem key={type} type={type} />
            ))}
          </MenuGroup>
        ))}
      </div>
    </ScrollArea>
  );
};
