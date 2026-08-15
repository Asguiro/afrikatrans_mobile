import type {CatalogApi} from '../contracts';
import {httpRequest} from './client';

export const httpCatalogApi: CatalogApi = {
  listCountries: () => httpRequest('/countries', {auth: false}),
  listOperators: countryCode =>
    httpRequest(
      countryCode
        ? `/operators?countryCode=${encodeURIComponent(countryCode)}`
        : '/operators',
      {auth: false},
    ),
};
