import { afterEach, describe, expect, it } from 'vitest';
import { ContentIcon } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { Tab } from '../TabSetsStore';
import { DEFAULT_ICON } from '../tabsConstants';
import { getTabIcon } from './getTabIcon';

const RegisteredViewType = 'test:view:fixed-icon';
const RegisteredIcon = 'search';

// A tab showing the given view in its main pane
function tab(main: Tab['main']): Tab {
  return {
    id: 'tab_1' as Tab['id'],
    main,
    split: null,
    splitRatio: 50,
  };
}

describe('getTabIcon', () => {
  afterEach(() => {
    Views.Store.clear();
  });

  it("renders the entity's content icon", () => {
    const icon = getTabIcon(
      tab({ view: 'test:view', icon: 'content-icon:box:default' }),
    );

    expect(icon).toEqual(<ContentIcon icon="content-icon:box:default" />);
  });

  it('falls back to the registered ui icon', () => {
    Views.register({
      type: RegisteredViewType,
      component: () => null,
      icon: RegisteredIcon,
    });

    expect(getTabIcon(tab({ view: RegisteredViewType }))).toBe(RegisteredIcon);
  });

  it('falls back to the default icon', () => {
    expect(getTabIcon(tab({ view: 'test:view' }))).toBe(DEFAULT_ICON);
  });

  it('falls back to the default icon for a blank tab', () => {
    expect(getTabIcon(tab(null))).toBe(DEFAULT_ICON);
  });
});
