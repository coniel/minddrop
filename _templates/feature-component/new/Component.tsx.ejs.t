---
to: features/<%= location %>/src/<%= name %>/<%= name %>.tsx
---
import './<%= name %>.css';

export interface <%= name %>Props {
  foo?: string;
}

export const <%= name %>: React.FC<<%= name %>Props> = ({ foo }) => {
  return (
    <div className="<%= h.toKebabCase(name) %>">
      {foo}
    </div>
  );
};
