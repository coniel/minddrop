import { useCallback } from 'react';
import { LayoutRenderer } from '@minddrop/feature-designs-legacy';
import {
  Space,
  Spaces,
  resolveSpaceMediaDirPath,
  setLayoutElementContent,
} from '@minddrop/spaces';
import { ScrollArea, TransientViewStateScope } from '@minddrop/ui-primitives';
import './SpaceContent.css';

export interface SpaceContentProps {
  /**
   * The space to render the layout of.
   */
  space: Space;
}

/**
 * Renders a space's layout in a scrollable container.
 */
export const SpaceContent: React.FC<SpaceContentProps> = ({ space }) => {
  // Persist element static content updates (e.g. a created view
  // reference) into the space's layout
  const handleUpdateElementContent = useCallback(
    (elementId: string, content: string) => {
      Spaces.update(space.id, {
        layout: setLayoutElementContent(space.layout, elementId, content),
      });
    },
    [space.id, space.layout],
  );

  return (
    <TransientViewStateScope segment={space.id}>
      <ScrollArea className="space-content" stateKey="content">
        <LayoutRenderer
          layout={space.layout}
          context="page"
          mediaDirPath={resolveSpaceMediaDirPath(space.id)}
          propertyMap={{}}
          propertyValues={{}}
          properties={[]}
          onUpdateElementContent={handleUpdateElementContent}
        />
      </ScrollArea>
    </TransientViewStateScope>
  );
};
