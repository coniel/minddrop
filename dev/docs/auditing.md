# Auditing

How a work group is audited against the writing docs before it goes to code review. The governing rule is that finding and fixing are separate passes done by separate agents: an author auditing its own work rationalises what it wrote, and an auditor allowed to edit stops reading once it starts fixing.

The trigger is "audit the work group": run the whole procedure below for the work group in progress, then report. Run it per work group, before its first review, so each sweep stays small and the findings shape the next group's code.

## The docs

One pass per doc, each with that doc as its sole authority:

- `dev/docs/commenting.md`
- `dev/docs/testing.md`
- `dev/docs/writing-functions.md`
- `dev/docs/writing-components.md`

The passes run in parallel. A pass covers every file in the work group manifest, including tests, CSS and test utils, and reads the doc in full before reading any code.

## The findings pass

Each auditor reports findings only, grouped by file, non-test sources first, in a fixed shape:

- `path:line`
- the offending text, or the gap (an uncommented statement group, a missing `@returns`, a helper a second component could call)
- the rule broken, in the doc's own words
- a proposed replacement, or the move to make

Nothing else: no praise, no summaries of what is fine, no edits. An auditor which spot-checks its own findings against the current files before reporting is worth the extra minute.

The findings come back to the session running the audit, which reads every one and decides. A finding is rejected when the proposal breaks the doc on its own terms, or when the plan entry already records the decision it argues against. Rejections are judgement calls, recorded in the plan entry under "Audit against the writing docs" so the next reviewer does not raise them again.

## The apply pass

Structural findings (moves between packages, splits into one function per file, types out of hook files, hook order) are applied first, by the session or by scripts it writes, since they change the line numbers every comment finding anchors to. The comment findings are then applied by parallel agents, one per package group, each given its share of the findings and one shared brief.

The brief, filled in per audit:

```
# Applying the <doc> audit findings

Repository: <worktree path> (a git worktree; work only inside it, never
cd to the main checkout, never run any version-control command that
writes: no commit, stash, checkout, reset).

The authority is `dev/docs/<doc>.md` in that repository. Read it fully
before starting, especially <the sections the findings lean on>.

Style facts enforced by tooling: a single-line `//` step comment has no
full stop; a comment spanning more than one line is full sentences ending
in full stops; JSDoc sentences end in full stops; CSS comments follow the
same rule. Wrap comments at 80 columns like the surrounding code.

Your findings file is <path>. Its line numbers are STALE: the files were
refactored after the audit. Re-find every anchor by the quoted code or
comment text. Some files were renamed or their contents moved (see the
map below); apply the finding at the new location. Where the quoted code
no longer exists, skip the finding and list it in your report. Where the
file already matches, move on.

The replacements are proposals. Apply them unless they break a rule in
the doc (a step comment restating what a name or type already says, a
why the neighbouring step already gives); then write the version which
follows the doc, and keep it terse. Never change code, only comments,
JSDoc and test names.

After the listed findings, scan every file you touched, plus <the "also
check" files for this group>, for remaining density gaps on functions
this work group added or changed, and fill them in the same style. Leave
code outside the work group alone.

Renamed and moved files (old → new):
<one line per rename>

When done, run from the package directory of each touched file:
`npx prettier --write <files>` and `npx eslint <files>`, and fix what
eslint reports. Do not run test suites and do not typecheck.

Report: the findings you skipped and why, any finding you applied
differently from the proposal and why, and the full list of files you
touched.
```

The reports are read, not skimmed. A finding applied differently is checked against the doc; a skipped finding is checked for an anchor the agent failed to re-find.

## After the passes

Run, in this order, and fix what fails:

1. `npx prettier --check` and `npx eslint` over every changed file, per package.
2. The suites of every touched package, and confirm any test the audit rewrote still fails when its behaviour is broken.
3. The app typecheck from `features/desktop-app`, and the per-package typecheck (`pnpm turbo run typecheck --concurrency=1`). Only the second one sees test files, so an unused import in a new test only shows there.

Then bring the work group manifest up to date with every file the audit added, renamed or deleted, and amend the WIP commit.

## What the audits keep finding

Read for these while writing, not only after:

- A comment stating context or a precondition above a line instead of the action the line takes.
- A "which" or participle clause hung off the end of a sentence, where two sentences were wanted.
- The well-named call the function was built around left without a step comment, because its name reads as documentation.
- `@param` lines without the dash, and functions with a return value but no `@returns`.
- A domain-free helper left in the package that first needed it, and a helper bound to one component's markup hoisted to `utils/`.
- Local helpers and option or return types living in a hook's file rather than their own.
- A non-trivial test helper documented with a line comment rather than JSDoc.
- A test which cannot fail: a mock of the thing under test, or an assertion the previous step already guaranteed.
