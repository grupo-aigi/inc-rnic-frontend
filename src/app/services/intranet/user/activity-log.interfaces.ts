export interface ActivityItem {
  id: number;
  type: ActivityLogType;
  description: string;
  createdAt: Date;
}

export enum ActivityLogType {
  REGISTER = 'REGISTER',
  LINKED = 'LINKED',
  COMMISSIONS_CHANGED = 'COMMISSIONS_CHANGED',
  BLOCKED = 'BLOCKED',
  UNBLOCKED = 'UNBLOCKED',
}
