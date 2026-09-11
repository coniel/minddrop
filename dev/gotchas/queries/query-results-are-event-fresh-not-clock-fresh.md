---
title: 'Query results are event-fresh, not clock-fresh'
package: packages/queries
summary: 'useQueryResults only re-runs on data events, so relative date filters (Today, Last N days) go stale until a data event or remount'
paths:
  - 'packages/queries/src/useQueryResults.ts'
  - 'packages/queries/src/useQueryNodeResults.ts'
  - 'packages/queries/src/runQueryNode/runQueryNode.ts'
tags: [queries, hooks, dates, staleness]
---

# Query results are event-fresh, not clock-fresh

`useQueryResults` / `useQueryNodeResults` re-run only on data events (source database SQL syncs, reindexes, background syncs) and query document edits. Relative date values ("Today", "Last N days") are resolved against `now` at run time, so time passing never triggers a re-run: an entry aging out of a "Last 7 days" window, or "Today" crossing midnight, stays in the results until the next data event or remount. A possible fix is scheduling a re-run (e.g. at the next local midnight) whenever the compiled graph contains relative date values.
