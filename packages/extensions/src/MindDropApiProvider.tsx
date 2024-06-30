import { createContext } from '@minddrop/utils';
import { MindDropApi } from './types/MindDropApi.types';
import { MindDropApi as Api } from './MindDropApi';

const [hook, Provider] = createContext<MindDropApi>();

export const MindDropApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Provider value={Api}>{children}</Provider>;

export const useApi = hook;
