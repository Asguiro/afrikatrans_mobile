import type {AuthApi} from '../contracts';
import {httpRequest} from './client';

export const httpAuthApi: AuthApi = {
  register: input =>
    httpRequest('/auth/register', {method: 'POST', body: input, auth: false}),
  verifyOtp: input =>
    httpRequest('/auth/verify-otp', {method: 'POST', body: input, auth: false}),
  login: input =>
    httpRequest('/auth/login', {method: 'POST', body: input, auth: false}),
  refresh: refreshToken =>
    httpRequest('/auth/refresh', {
      method: 'POST',
      body: {refreshToken},
      auth: false,
    }),
  me: () => httpRequest('/me'),
  updateMe: input => httpRequest('/me', {method: 'PATCH', body: input}),
  changePassword: input =>
    httpRequest('/auth/change-password', {method: 'POST', body: input}),
  setPin: pin => httpRequest('/auth/pin', {method: 'POST', body: {pin}}),
  verifyPin: pin =>
    httpRequest('/auth/pin/verify', {method: 'POST', body: {pin}}),
  changePin: input =>
    httpRequest('/auth/pin/change', {method: 'POST', body: input}),
};
