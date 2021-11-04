---
to: packages/<%= package %>/src/<%= name %>/<%= name %>.test.ts
---
import { <%= name %> } from './<%= name %>';

describe('<%= name %>', () => {
  it('does something useful', () => {
    expect(<%= name %>('foo')).toBe('foo');
  });
});
