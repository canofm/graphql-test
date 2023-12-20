import { OrganizationService } from '../services/organizationService';
import { PlanService } from '../services/planService';
import { SubscriptionService } from '../services/subscriptionService';

export type ContextResolver = {
  organizationService: OrganizationService;
  planService: PlanService;
  subscriptionService: SubscriptionService;
};
