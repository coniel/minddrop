import { DesignElement } from '@minddrop/designs';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '@minddrop/ui-primitives';
import { PropertyElementIcon } from '../PropertyElementIcon';

export interface ElementIconProps {
  element: DesignElement;
}

const icons: Record<DesignElement['type'], UiIconName> = {
  text: 'text',
  container: 'layout',
  'text-property': 'text',
  'title-property': 'text',
  'url-property': 'link',
  'image-property': 'image',
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

export const ElementIcon: React.FC<ElementIconProps> = ({ element }) => {
  if ('property' in element) {
    return (
      <PropertyElementIcon
        className="element-icon"
        element={element}
        color="inherit"
      />
    );
  }

  return (
    <Icon className="element-icon" name={icons[element.type]} color="inherit" />
  );
};
