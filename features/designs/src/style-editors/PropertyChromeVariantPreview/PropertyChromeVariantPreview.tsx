import { useTranslation } from '@minddrop/i18n';
import '../../design-elements/property/PropertyChrome/PropertyChrome.css';
import './PropertyChromeVariantPreview.css';

export interface PropertyChromeVariantPreviewProps {
  /**
   * Whether the chrome piece stacks above the value.
   */
  above: boolean;

  /**
   * Whether the value is pushed to the row's far side.
   */
  spread?: boolean;

  /**
   * The chrome piece being previewed.
   */
  children: React.ReactNode;
}

/**
 * Renders a chrome variant's sample: the chrome piece arranged
 * around a stand-in value line through the chrome's own layout
 * classes, so the preview arranges exactly as the renderer does.
 */
export const PropertyChromeVariantPreview: React.FC<
  PropertyChromeVariantPreviewProps
> = ({ above, spread = false, children }) => {
  const { t } = useTranslation();

  return (
    <div className="designs-property-chrome designs-chrome-variant-preview">
      {/** The chrome row above the value **/}
      {above && <div className="designs-property-chrome-group">{children}</div>}

      {/** The value row, with side-positioned chrome beside it **/}
      <div
        className={
          spread
            ? 'designs-property-chrome-row designs-property-chrome-row-spread'
            : 'designs-property-chrome-row'
        }
      >
        {!above && children}
        <span className="designs-chrome-variant-preview-value">
          {t('designsStudio.style.chromePreview.value')}
        </span>
      </div>
    </div>
  );
};
