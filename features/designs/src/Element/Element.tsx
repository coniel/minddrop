import { ReactElement } from 'react';
import { ElementSchema } from '@minddrop/designs';
import { ContainerElement } from '../ContainerElement';
import { ImageElement } from '../ImageElement';
import { StaticTextElement } from '../StaticTextElement';
import { TextElement } from '../TextElement';
import { TitleElement } from '../TitleElement';
import { UrlElement } from '../UrlElement';

export interface ElementProps extends React.HTMLProps<HTMLDivElement> {
  element: ElementSchema;
  index?: number;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  let elementComponent: ReactElement<ElementSchema> | null = null;

  switch (element.type) {
    case 'container':
      elementComponent = <ContainerElement element={element} />;
      break;
    case 'static-text':
      elementComponent = <StaticTextElement element={element} />;
      break;
    case 'title':
      elementComponent = <TitleElement element={element} />;
      break;
    case 'text':
      elementComponent = <TextElement element={element} />;
      break;
    case 'url':
      elementComponent = <UrlElement element={element} />;
      break;
    case 'image':
      elementComponent = <ImageElement element={element} />;
      break;
    default:
      elementComponent = null;
  }

  return elementComponent;
};
