import { Designs } from '@minddrop/designs';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { Space, resolveSpaceMediaDirPath } from '@minddrop/spaces';
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
  // The space's design from the designs store, falling back to the
  // persisted copy while the store hydrates
  const design = Designs.use(space.design.id);
  const layout = design?.layouts[0] ?? space.design.layouts[0];

  if (!layout) {
    return null;
  }

  return (
    <TransientViewStateScope segment={space.id}>
      <ScrollArea className="space-content" stateKey="content">
        <LayoutRenderer
          layout={layout}
          context="page"
          mediaDirPath={resolveSpaceMediaDirPath(space.id)}
          propertyMap={{}}
          propertyValues={{}}
          properties={[]}
        />
      </ScrollArea>
    </TransientViewStateScope>
  );
};
