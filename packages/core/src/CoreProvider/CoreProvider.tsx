import React, { useMemo } from 'react';
import { initializeCore } from '../initializeCore';
import { Core } from '../types';

const defaultCore = initializeCore({ extensionId: '' });

const CoreContext = React.createContext<Core>(defaultCore);

export interface CoreProviderProps {
  children: React.ReactNode;
}

export const CoreProvider: React.FC<CoreProviderProps> = ({ children }) => {
  const core = useMemo(() => initializeCore({ extensionId: '' }), []);

  return <CoreContext.Provider value={core}>{children}</CoreContext.Provider>;
};

export const useCore = (extensionId: string) => {
  return initializeCore({ extensionId });
};
