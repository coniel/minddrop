---
to: packages/<%= package %>/src/<%= name %>/<%= name %>.test.ts
---
import { setup, cleanup } from '../test-utils';
import { <%= name %> } from './<%= name %>';

describe('<%= name %>', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    //
  });
});
