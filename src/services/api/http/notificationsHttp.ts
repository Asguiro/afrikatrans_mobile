import type {NotificationsApi} from '../contracts';
import {httpRequest} from './client';

export const httpNotificationsApi: NotificationsApi = {
  list: opts => {
    const q = opts?.unreadOnly ? '?unreadOnly=true' : '';
    return httpRequest(`/notifications${q}`);
  },
  getPreferences: () => httpRequest('/notifications/preferences'),
  updatePreferences: input =>
    httpRequest('/notifications/preferences', {
      method: 'PATCH',
      body: input,
    }),
  markRead: id =>
    httpRequest(`/notifications/${id}/read`, {method: 'PATCH'}),
  markAllRead: () =>
    httpRequest('/notifications/read-all', {method: 'POST'}),
};
