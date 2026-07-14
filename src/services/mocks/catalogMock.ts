import type {CatalogApi} from '../api/contracts';
import {delay, ok} from '../api/helpers';
import {mockCountries, mockOperators} from './fixtures';

export const mockCatalogApi: CatalogApi = {
  async listCountries() {
    await delay();
    return ok(mockCountries);
  },
  async listOperators(countryCode) {
    await delay();
    const data = countryCode
      ? mockOperators.filter(o => o.countryCode === countryCode)
      : mockOperators;
    return ok(data);
  },
};
