import { CSSProperties } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import './DesignPreviewOverlay.css';

export interface DesignPreviewOverlayProps extends Record<string, unknown> {
  /**
   * The i18n key for the message displayed on hover.
   */
  label: TranslationKey;

  /**
   * Optional CSS styles applied to the wrapper.
   */
  style?: CSSProperties;

  /**
   * The content to render beneath the overlay.
   */
  children: React.ReactNode;
}

/**
 * Renders children with a transparent overlay on top that blocks
 * all interaction and shows a message on hover. Used in preview
 * mode for interactive elements like editors and image viewers.
 */
export const DesignPreviewOverlay: React.FC<DesignPreviewOverlayProps> = ({
  label,
  style,
  children,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div {...rest} className="design-preview-overlay-wrapper" style={style}>
      {children}

      {/* Transparent overlay blocking interaction */}
      <div className="design-preview-overlay">
        <div className="design-preview-overlay-message">{t(label)}</div>
      </div>
    </div>
  );
};
