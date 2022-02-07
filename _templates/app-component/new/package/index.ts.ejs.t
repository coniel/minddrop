---
inject: true
to: packages/app-ui/src/index.ts
append: true
---
export * from './<%= name %>';