---
inject: true
to: <%= location %>/<%= package %>/src/components/index.ts
append: true
---
export * from './<%= name %>';
