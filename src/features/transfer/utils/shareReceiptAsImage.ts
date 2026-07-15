import type {RefObject} from 'react';
import type {View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import {withAppLockSuppressed} from '../../../stores/appLockGateStore';

/**
 * Capture le reçu en PNG et l’ouvre dans la feuille de partage native.
 * Aucun texte de reçu — uniquement l’image.
 */
export async function shareReceiptAsImage(
  viewRef: RefObject<View | null>,
  reference: string,
): Promise<void> {
  if (!viewRef.current) {
    throw new Error('Reçu non prêt au partage');
  }

  const base64 = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: 'base64',
  });

  const safeRef = reference.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);

  await withAppLockSuppressed(async () => {
    await Share.open({
      title: 'Reçu AfrikaTrans',
      url: `data:image/png;base64,${base64}`,
      type: 'image/png',
      filename: `Afrikatrans-recu-${safeRef || 'transfert'}`,
      failOnCancel: false,
      useInternalStorage: true,
    });
  });
}
