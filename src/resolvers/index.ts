import db from '../db';
import { PlanService } from '../services/planService';
import { SubscriptionService } from '../services/subscriptionService';

export type ContextResolver = {
  db: typeof db;
  planService: PlanService;
  subscriptionService: SubscriptionService;
};
