import { DesignElement } from '@minddrop/designs';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '@minddrop/ui-primitives';
import { FlatDesignElement } from '../../types';
import { PropertyElementIcon } from '../PropertyElementIcon';

export interface ElementIconProps {
  element: FlatDesignElement;
}

const icons: Record<DesignElement['type'], UiIconName> = {
  root: 'layout',
  text: 'text',
  container: 'layout',
  'text-property': 'text',
  'formatted-text-property': 'text',
  'title-property': 'text',
  'url-property': 'link',
  'image-property': 'image',
  'number-property': 'hash',
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
