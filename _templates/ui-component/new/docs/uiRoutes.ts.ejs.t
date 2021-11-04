---
inject: true
to: packages/docs/lib/uiRoutes.ts
before: TEMPLATE_APPEND
---
      { title: '<%= name %>', slug: 'docs/ui/components/<%= h.toKebabCase(name) %>' },