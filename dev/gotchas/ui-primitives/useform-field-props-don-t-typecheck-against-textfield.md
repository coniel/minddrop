---
title: "useForm field props don't typecheck against TextField"
package: ui/primitives
summary: 'Spreading useForm fieldProps onto TextField fails typecheck: error is string vs TranslationKey; known, unresolved'
paths:
  - 'packages/utils/src/useForm/**'
  - 'ui/primitives/src/fields/TextField/**'
tags: [useform, textfield, typescript, i18n]
---

# `useForm` field props don't typecheck against `TextField`

`useForm`'s `fieldProps` carry `error?: string` (validators return plain message strings), but `TextField`'s `error` prop is typed `TranslationKey` — spreading `{...fieldProps.x}` onto a `TextField` fails the typecheck (see `CreateDataViewForm`). Existing forms live with the error; a real fix means deciding whether form validators return translation keys or `TextField` accepts plain strings.
