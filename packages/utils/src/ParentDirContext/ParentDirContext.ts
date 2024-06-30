import { createContext } from '../createContext';

const [hook, Provider] = createContext<string>();

export const ParentDirProvider = Provider;
export const useParentDir = hook;
