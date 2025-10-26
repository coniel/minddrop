---
inject: true
to: features/<%= location %>/src/index.ts
append: true
---
export * from './<%= name %>';
