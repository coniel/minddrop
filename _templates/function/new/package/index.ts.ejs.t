---
inject: true
to: packages/<%= package %>/src/index.ts
append: true
---
export * from './<%= name %>';