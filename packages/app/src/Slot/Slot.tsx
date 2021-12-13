import React, { ComponentType } from 'react';
import { UiComponentConfigType, UiExtensionConfig } from '../types';
import { useUiExtensions } from '../useAppStore';

export type UiComponentConfigMap = Record<UiComponentConfigType, ComponentType>;

export interface SlotProps {
  location: string;
  components: UiComponentConfigMap;
}

export const Slot: React.FC<SlotProps> = ({ location, components }) => {
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
