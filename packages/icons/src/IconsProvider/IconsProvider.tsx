import React from 'react';
import { createContext, toKebabCase } from '@minddrop/utils';
import { IconName } from '../icons.types';
import * as Icons from '../icons';

type IconSet = Record<
  IconName,
  React.ElementType<React.HTMLAttributes<SVGElement>>
>;

const defaultIconSet = Object.keys(Icons).reduce(
  (iconSet, key) => ({
    ...iconSet,
    [toKebabCase(key)]: (
      Icons as unknown as Record<
        string,
        React.ElementType<React.HTMLAttributes<SVGElement>>
      >
    )[key],
  }),
  {},
) as unknown as IconSet;

export interface IconsProviderProps {
  children: React.ReactNode;
  icons?: Partial<IconSet>;
}

const [hook, Provider, Consumer] = createContext<IconSet>();

export const IconsProvider: React.FC<IconsProviderProps> = ({
  children,
  icons,
}) => <Provider value={{ ...defaultIconSet, ...icons }}>{children}</Provider>;

export const useIcons = hook;
export const IconsConsumer = Consumer;
