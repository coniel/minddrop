import { ReactElement } from 'react';
import { ElementSchema, RootElementSchema } from '@minddrop/designs';
import { CardElement } from '../CardElement';
import { ListElement } from '../ListElement';
import { PageElement } from '../PageElement';

export interface ElementProps {
  element: RootElementSchema;
}

export const RootElement: React.FC<ElementProps> = ({ element }) => {
  let elementComponent: ReactElement<ElementSchema> | null = null;

  switch (element.type) {
    case 'card':
      elementComponent = <CardElement element={element} />;
      break;
    case 'list':
      elementComponent = <ListElement element={element} />;
      break;
    case 'page':
      elementComponent = <PageElement element={element} />;
      break;
    default:
      elementComponent = null;
  }

  return elementComponent;
};
