import React, { useMemo } from 'react';
import { initializeCore } from '../initializeCore';
import { Core } from '../types';

const defaultCore = initializeCore({ appId: '', extensionId: '' });

const CoreContext = React.createContext<Core>(defaultCore);

export interface CoreProviderProps {
  appId: string;
}

export const CoreProvider: React.FC<CoreProviderProps> = ({
  appId,
  children,
}) => {
  const core = useMemo(
    () => initializeCore({ appId, extensionId: '' }),
    [appId],
  );

  return <CoreContext.Provider value={core}>{children}</CoreContext.Provider>;
};

export const useCore = (extensionId: string) => {
  const core = React.useContext(CoreContext);

  return initializeCore({ appId: core.appId, extensionId });
};
