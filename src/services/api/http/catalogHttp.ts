import type {CatalogApi} from '../contracts';
import {httpRequest} from './client';

export const httpCatalogApi: CatalogApi = {
  listCountries: () => httpRequest('/catalog/countries', {auth: false}),
  listOperators: countryCode =>
    httpRequest(
      countryCode
        ? `/catalog/operators?countryCode=${encodeURIComponent(countryCode)}`
        : '/catalog/operators',
      {auth: false},
    ),
};
