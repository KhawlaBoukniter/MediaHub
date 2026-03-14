export enum Plan {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface SubscriptionRequest {
  userId: number;
  plan: Plan;
}

export interface SubscriptionResponse {
  id: number;
  userId: number;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}
