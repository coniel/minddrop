import { mapPropsToClasses } from './mapPropsToClasses';

describe('mapPropsToClasses', () => {
  it('should return boolean prop name if true', () => {
    expect(mapPropsToClasses({ disabled: true, fullWidth: false })).toBe(
      'disabled',
    );
  });

  it('should return string props as [key]-[value]', () => {
    expect(mapPropsToClasses({ size: 'small', variant: 'contained' })).toBe(
      'size-small variant-contained',
    );
  });

  it('should work with no props', () => {
    expect(mapPropsToClasses({})).toBe('');
  });

  it('should append className prop', () => {
    expect(mapPropsToClasses({ className: 'my-class', disabled: true })).toBe(
      'disabled my-class',
    );
  });

  it('should prepend the root class', () => {
    expect(mapPropsToClasses({ disabled: true }, 'button')).toBe(
      'button disabled',
    );
  });

  it('should convert camelCase to kebab-case', () => {
    expect(mapPropsToClasses({ fullWidth: true })).toBe('full-width');
  });

  it('should work with all options', () => {
    expect(
      mapPropsToClasses(
        {
          className: 'my-class',
          size: 'small',
          disabled: true,
        },
        'button',
      ),
    ).toBe('button size-small disabled my-class');
  });
});
