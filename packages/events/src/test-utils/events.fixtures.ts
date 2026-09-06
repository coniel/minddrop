// Test events registered in the event data registry below
export const TestFooEvent = 'test:foo';
export const TestBarEvent = 'test:bar';

declare module '../types/EventDataMap.types' {
  interface EventDataMap {
    'test:foo': unknown;
    'test:bar': unknown;
  }
}
