import { describe, expect, it } from 'vitest';
import { ZoomPresets } from '../../constants';
import { resolveZoomStep } from './resolveZoomStep';

const smallest = ZoomPresets[0];
const largest = ZoomPresets[ZoomPresets.length - 1];

describe('resolveZoomStep', () => {
  it('steps in to the nearest preset above the zoom', () => {
    expect(resolveZoomStep(1.1, 'in')).toBe(1.25);
  });

  it('steps out to the nearest preset below the zoom', () => {
    expect(resolveZoomStep(1.1, 'out')).toBe(1);
  });

  it('steps past a zoom sitting on a preset', () => {
    expect(resolveZoomStep(1, 'in')).toBe(1.25);
    expect(resolveZoomStep(1, 'out')).toBe(0.75);
  });

  it('resolves no step past the ends of the presets', () => {
    expect(resolveZoomStep(largest, 'in')).toBeNull();
    expect(resolveZoomStep(smallest, 'out')).toBeNull();
  });

  it('resolves no step out from a zoom below every preset', () => {
    expect(resolveZoomStep(smallest / 2, 'out')).toBeNull();
  });

  it('resolves no step in from a zoom above every preset', () => {
    expect(resolveZoomStep(largest * 2, 'in')).toBeNull();
  });
});
