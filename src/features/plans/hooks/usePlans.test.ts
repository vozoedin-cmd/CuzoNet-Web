import { describe, expect, it } from 'vitest';

import { planKeys } from './usePlans';

describe('Plans query contracts', () => {
  it('usa una query key estable para la lista real', () => {
    expect(planKeys.list()).toEqual(['plans', 'list']);
  });
});
