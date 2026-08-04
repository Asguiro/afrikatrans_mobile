export function formatMoney(amount: number, currency = 'XOF'): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Date + heure sur une ligne (reçu / récap). */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const date = d.toLocaleDateString('fr-FR');
  const time = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${date} ${time}`;
}

/** « Sénégal vers Côte d'Ivoire » à partir de noms de pays. */
export function formatCorridorOperation(
  sourceCountryName: string,
  destinationCountryName: string,
): string {
  return `${sourceCountryName} vers ${destinationCountryName}`;
}

/** Corridor compact ex. `SN → CI`. */
export function formatCorridorCodes(
  sourceCountryCode: string,
  destinationCountryCode: string,
): string {
  return `${sourceCountryCode} → ${destinationCountryCode}`;
}

/** Date + heure style historique : `15/07/2026 - 19:23:02`. */
export function formatHistoryDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const date = d.toLocaleDateString('fr-FR');
  const time = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${date} - ${time}`;
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    CREATED: 'Créée',
    PENDING_DEBIT: 'Débit en cours',
    DEBITED: 'Débitée',
    PENDING_PAYOUT: 'Crédit en cours',
    COMPLETED: 'Terminée',
    FAILED: 'Échouée',
    CANCELLED: 'Annulée',
    NONE: 'Non démarré',
    PENDING: 'En attente',
    IN_REVIEW: 'En revue',
    APPROVED: 'Validé',
    REJECTED: 'Rejeté',
    NEEDS_RESUBMISSION: 'À reprendre',
  };
  return map[status] ?? status;
}
