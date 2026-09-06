import { DynamicIcon } from 'lucide-react/dynamic';
import { createContext } from '@minddrop/utils';

export interface IconsProviderProps {
  children: React.ReactNode;
}

export interface IconsProviderContext {
  UiIcon: typeof DynamicIcon;
}

const [hook, Provider, Consumer] = createContext<IconsProviderContext>();

export const IconsProvider: React.FC<IconsProviderProps> = ({ children }) => (
  <Provider value={{ UiIcon: DynamicIcon }}>{children}</Provider>
);

export const useIcons = hook;
export const IconsConsumer = Consumer;
