import { ViewTypeComponentProps } from '@minddrop/views';
import { defaultWallViewOptions } from '../constants';
import { WallViewOptions } from '../types';
import './WallViewComponent.css';

export const WallViewComponent: React.FC<
  ViewTypeComponentProps<WallViewOptions>
> = ({ view, elements }) => {
  return (
    <div
      className="wall-view"
      style={{
        // @ts-expect-error - Works fine
        '--max-columns':
          view.options?.maxColumns || defaultWallViewOptions.maxColumns,
      }}
    >
      {elements.map((element) => (
        <div key={element} className="element">
          {element}
        </div>
      ))}
    </div>
  );
};
