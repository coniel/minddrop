---
inject: true
to: ui/<%= location %>/src/index.ts
append: true
---
export * from './<%= name %>';
