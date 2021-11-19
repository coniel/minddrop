import { App, EventListener, UninitializedApp } from './types';
import { useStore } from './useStore';

export interface InitializedApp {
  app: App;
  eventListeners: EventListener[];
}

const eventListeners: EventListener[] = [];

export function initializeApp(extensionId: string): App {
  const app: UninitializedApp = {
    addEventListener: (source, type, callback) =>
      eventListeners.push({ source, type, callback }),

    dispatch: (source, type, data) => {
      eventListeners
        .filter((listener) => listener.type === type)
        .forEach((listener) => listener.callback(data));
    },
  };

  app.addEventListener('core', 'load-topics', (topics) => {
    useStore.setState((state) => ({ topics: [...state.topics, ...topics] }));
  });

  app.addEventListener('core', 'add-topic', (topic) => {
    useStore.setState((state) => ({ topics: [...state.topics, topic] }));
  });

  return {
    ...app,
    addEventListener: (type, callback) =>
      app.addEventListener(extensionId, type, callback),
    dispatch: (type, data) => app.dispatch(extensionId, type, data),
  };
}
