import { Design, resolveDesignMediaDirPath } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { TransientViewStateScope } from '@minddrop/ui-primitives';
import { DesignPropertySchemasProvider } from '../DesignPropertiesProvider';
import { useDesignStudioStore } from '../DesignStudioStore';
import { MediaDirProvider } from '../MediaDirContext';

export interface DesignStudioScopeProps extends React.PropsWithChildren {
  /**
   * The design open in the studio.
   */
  design: Design;
}

/**
 * Provides the open design's property schemas and media directory
 * to the whole studio: the canvas resolves element placeholders
 * and background images through them, and the style editor panel
 * reads and writes media files through them. Wraps every panel
 * rather than the canvas alone, since the editors sit beside it.
 *
 * Also scopes the studio's transient view state to the design, so
 * the panels return to how they were left when the studio remounts
 * (e.g. on a tab switch).
 */
export const DesignStudioScope: React.FC<DesignStudioScopeProps> = ({
  design,
  children,
}) => {
  // Prefer the store's media directory, which the standalone
  // layout editor points at its own owner's media
  const storeMediaDirPath = useDesignStudioStore((state) => state.mediaDirPath);

  const mediaDirPath =
    storeMediaDirPath ?? resolveDesignMediaDirPath(design.id);

  return (
    <DesignPropertySchemasProvider properties={resolveProperties(design)}>
      <MediaDirProvider value={mediaDirPath}>
        <TransientViewStateScope segment={design.id}>
          {children}
        </TransientViewStateScope>
      </MediaDirProvider>
    </DesignPropertySchemasProvider>
  );
};

/**
 * Returns the design's property schemas, which only database
 * designs carry.
 */
function resolveProperties(design: Design): PropertiesSchema {
  if (design.type !== 'database') {
    return [];
  }

  return design.properties;
}
