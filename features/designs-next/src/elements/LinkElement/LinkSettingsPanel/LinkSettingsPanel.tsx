import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  Stack,
  Toggle,
  ToggleGroup,
} from '@minddrop/ui-primitives';
import { UrlPart, UrlParts } from '@minddrop/utils';
import { LinkElement } from '../LinkElement.types';
import { DefaultLinkUrlParts } from '../constants';

// The name of each part
const UrlPartLabels: Record<UrlPart, TranslationKey> = {
  protocol: 'designsNext.elements.link.parts.protocol',
  subdomain: 'designsNext.elements.link.parts.subdomain',
  domain: 'designsNext.elements.link.parts.domain',
  tld: 'designsNext.elements.link.parts.tld',
  path: 'designsNext.elements.link.parts.path',
};

// The piece of a sample address each part toggle shows, with the
// dots joining it to its neighbours, so the row reads as an address.
const UrlPartSamples: Record<UrlPart, string> = {
  protocol: 'https://',
  subdomain: 'www.',
  domain: 'example',
  tld: '.com',
  path: '/page',
};

/**
 * Renders a link element's settings.
 */
export const LinkSettingsPanel: React.FC<
  DesignElementSettingControlProps<LinkElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's shown parts, all of them by default
  const urlParts = element.urlParts ?? DefaultLinkUrlParts;

  // Applies the chosen parts
  function handlePartsChange(parts: UrlPart[]) {
    // Keep the last part shown
    if (!parts.length) {
      return;
    }

    // Apply the parts in the order they are written
    onChange({ urlParts: UrlParts.filter((part) => parts.includes(part)) });
  }

  return (
    <Stack gap={1}>
      <InputLabel size="xs" label="designsNext.elements.link.parts.label" />
      <ToggleGroup<UrlPart>
        size="sm"
        value={urlParts}
        onValueChange={handlePartsChange}
      >
        {UrlParts.map((part) => (
          <Toggle
            key={part}
            size="sm"
            value={part}
            label={t(UrlPartLabels[part])}
            tooltip={{ title: UrlPartLabels[part] }}
          >
            {UrlPartSamples[part]}
          </Toggle>
        ))}
      </ToggleGroup>
    </Stack>
  );
};
