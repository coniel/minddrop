import { createContext, useContext, useMemo, useState } from 'react';
import { ContentColor } from '@minddrop/ui-theme';

/**
 * The colour scheme hues the studio can preview: the content
 * colours, whose hues match the theme's scheme classes. The
 * default content colour maps to no scheme instead.
 */
export type PreviewScheme = Exclude<ContentColor, 'default'>;

interface DesignStudioPreview {
  /**
   * The scheme hue coloured backgrounds preview with, or null to
   * preview without a scheme.
   */
  scheme: PreviewScheme | null;

  /**
   * Sets the preview scheme hue.
   */
  setScheme(scheme: PreviewScheme | null): void;
}

const DesignStudioPreviewContext = createContext<DesignStudioPreview>({
  scheme: null,
  setScheme: () => {},
});

/**
 * Provides the studio's preview settings: the scheme hue coloured
 * backgrounds render with. A stand-in for real schemes until they
 * can be set on the owning entity.
 */
export const DesignStudioPreviewProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // Start on blue so the coloured treatment is visible out of the
  // box, since the accent channel otherwise defaults to neutral
  const [scheme, setScheme] = useState<PreviewScheme | null>('blue');

  // Keep the context value stable across unrelated re-renders
  const value = useMemo(() => ({ scheme, setScheme }), [scheme]);

  return (
    <DesignStudioPreviewContext.Provider value={value}>
      {children}
    </DesignStudioPreviewContext.Provider>
  );
};

/**
 * Returns the studio's preview settings.
 */
export function useDesignStudioPreview(): DesignStudioPreview {
  return useContext(DesignStudioPreviewContext);
}
