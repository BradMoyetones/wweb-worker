import { InferSelectModel } from 'drizzle-orm';
import { workflows } from '@core/drizzle/schema';

export type Workflow = InferSelectModel<typeof workflows>;