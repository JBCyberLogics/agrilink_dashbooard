/**
 * Proposed capability names for frontend navigation and API discussions.
 * These are not an authorization boundary; the backend must enforce every permission.
 */
export const PROPOSED_ADMIN_CAPABILITIES = [
  'users.read', 'users.update', 'users.verify',
  'marketplace.read', 'listings.moderate', 'transactions.read', 'disputes.manage',
  'support.manage', 'announcements.manage', 'reports.export', 'audit.read',
  'ai.read', 'ai.configure', 'algorithms.publish', 'market-data.manage',
  'settings.read', 'settings.update', 'administrators.manage', 'roles.manage',
] as const;

export type ProposedAdminCapability = (typeof PROPOSED_ADMIN_CAPABILITIES)[number];
