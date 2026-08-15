import type {NotificationsApi} from '../api/contracts';
import {createId, delay, ok} from '../api/helpers';
import type {AppNotification} from '../../types/api';

const inbox: AppNotification[] = [
  {
    id: 'notif_mock_1',
    title: 'Bienvenue',
    body: 'Activez les notifications pour suivre vos transferts.',
    readAt: null,
    createdAt: new Date().toISOString(),
  },
];

export const mockNotificationsApi: NotificationsApi = {
  async list() {
    await delay();
    return ok([...inbox]);
  },
  async getPreferences() {
    await delay();
    return ok({
      inApp: true,
      push: true,
      email: false,
      sms: false,
      smsUserControllable: false,
      emailAddress: null,
    });
  },
  async updatePreferences(input) {
    await delay();
    return ok({
      inApp: true,
      push: true,
      email: Boolean(input.emailEnabled),
      sms: false,
      smsUserControllable: false,
      emailAddress: null,
    });
  },
  async markRead(id) {
    await delay();
    const row = inbox.find(n => n.id === id);
    if (row) {
      row.readAt = new Date().toISOString();
    }
    return ok({read: true});
  },
  async markAllRead() {
    await delay();
    let updated = 0;
    for (const n of inbox) {
      if (!n.readAt) {
        n.readAt = new Date().toISOString();
        updated += 1;
      }
    }
    return ok({updated});
  },
};

/** Utilitaire tests / démo mock. */
export function pushMockNotification(title: string, body: string) {
  inbox.unshift({
    id: createId('notif'),
    title,
    body,
    readAt: null,
    createdAt: new Date().toISOString(),
  });
}
