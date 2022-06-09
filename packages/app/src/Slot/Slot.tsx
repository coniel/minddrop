import React, { ComponentType } from 'react';
import { PrimaryNavItem, SecondaryNavItem, IconButton } from '@minddrop/ui';
import { UiComponentConfigType, UiExtensionConfig } from '../types';
import { useUiExtensions } from '../useAppStore';

export type UiComponentConfigMap = Record<UiComponentConfigType, ComponentType>;

export interface SlotProps {
  location: string;
}

const components: UiComponentConfigMap = {
  'icon-button': IconButton,
  'primary-nav-item': PrimaryNavItem,
  'secondary-nav-item': SecondaryNavItem,
};

export const Slot: React.FC<SlotProps> = ({ location }) => {
  const extensions = useUiExtensions(location);

  function renderConfig(item: UiExtensionConfig) {
    const Component = components[item.element.type];

    return <Component key={item.id} {...item.element} />;
  }

  return (
    <>
      {extensions.map((item) =>
        item.type === 'component' ? (
          <item.element key={item.id} />
        ) : (
          renderConfig(item)
        ),
      )}
    </>
  );
};
