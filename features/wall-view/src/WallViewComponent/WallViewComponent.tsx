import { DatabaseEntryRenderer } from '@minddrop/feature-database-entries';
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
        <DatabaseEntryRenderer
          key={element}
          entryId={element}
          designType="card"
        />
      ))}
    </div>
  );
};
