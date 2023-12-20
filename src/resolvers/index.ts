import planResolver from './planResolver';
import queryResolver from './queryResolver';
import subscriptionResolver from './subscriptionResolver';

export default {
  Query: queryResolver,
  Plan: planResolver,
  Subscription: subscriptionResolver,
};
