import {ok, fail, unwrap, createId} from '../src/services/api/helpers';
import {ApiError} from '../src/types/api';
import {formatMoney, formatStatus} from '../src/utils/format';

describe('api helpers', () => {
  it('unwraps success payloads', () => {
    expect(unwrap(ok({id: 1}))).toEqual({id: 1});
  });

  it('throws ApiError on failure', () => {
    expect(() => unwrap(fail('X', 'message'))).toThrow(ApiError);
  });

  it('creates prefixed ids', () => {
    expect(createId('txn')).toMatch(/^txn_/);
  });
});

describe('format utils', () => {
  it('formats money in fr-FR', () => {
    expect(formatMoney(25000, 'XOF')).toContain('25');
  });

  it('maps statuses', () => {
    expect(formatStatus('COMPLETED')).toBe('Terminée');
  });
});
