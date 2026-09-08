import { describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { Breadcrumb } from '../../types';
import { ViewBreadcrumbsProvider } from '../ViewBreadcrumbsContext';
import { useViewBreadcrumbs } from './useViewBreadcrumbs';

describe('useViewBreadcrumbs', () => {
  it('returns the breadcrumbs from the surrounding provider', () => {
    const breadcrumbs: Breadcrumb[] = [
      { view: 'test:view:parent', viewId: 'test:parent', title: 'Parent' },
    ];

    const { result } = renderHook(() => useViewBreadcrumbs(), {
      wrapper: ({ children }) => (
        <ViewBreadcrumbsProvider breadcrumbs={breadcrumbs}>
          {children}
        </ViewBreadcrumbsProvider>
      ),
    });

    expect(result.current).toEqual(breadcrumbs);
  });

  it('returns an empty trail outside of a provider', () => {
    const { result } = renderHook(() => useViewBreadcrumbs());

    expect(result.current).toEqual([]);
  });
});
