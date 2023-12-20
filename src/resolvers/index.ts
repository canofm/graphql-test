import db from '../db';
import { PlanService } from '../services/planService';

export type ContextResolver = { db: typeof db; planService: PlanService };
