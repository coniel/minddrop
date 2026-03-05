import { FlatDateElement } from '../../types';
import { DateDesignElement } from './DateDesignElement';

export interface DateStudioDesignElementProps {
  element: FlatDateElement;
}

/**
 * Renders a date element in the design studio.
 * Delegates entirely to the common DateDesignElement.
 */
export const DateStudioDesignElement: React.FC<
  DateStudioDesignElementProps
> = ({ element }) => {
  return <DateDesignElement element={element} />;
};
