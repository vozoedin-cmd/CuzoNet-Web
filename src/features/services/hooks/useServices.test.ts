import { describe, expect, it } from 'vitest';

import {
  getOperationPollingInterval,
  serviceKeys,
} from './useServices';

describe('Services query contracts', () => {
  it('usa query keys estables por cliente, servicio y operación', () => {
    expect(serviceKeys.clientServices('client-1')).toEqual([
      'services',
      'client',
      'client-1',
    ]);
    expect(serviceKeys.detail('service-1')).toEqual([
      'services',
      'detail',
      'service-1',
    ]);
    expect(serviceKeys.operation('operation-1')).toEqual([
      'services',
      'operation',
      'operation-1',
    ]);
  });

  it.each(['queued', 'running'] as const)(
    'mantiene polling cada 5 segundos para %s',
    (status) => {
      expect(getOperationPollingInterval(status)).toBe(5000);
    },
  );

  it.each(['succeeded', 'failed', 'cancelled', 'manual_review'] as const)(
    'detiene polling en el estado terminal %s',
    (status) => {
      expect(getOperationPollingInterval(status)).toBe(false);
    },
  );
});
