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
