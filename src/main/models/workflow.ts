import { getDb } from "@core/drizzle/client";
import { workflows } from "@core/drizzle/schema";
import { Workflow } from "@core/types/data";


async function getAllWorkflows(): Promise<Workflow[]> {
  const db = await getDb();

  const allWorkflows = await db.select().from(workflows).all();
  
  return allWorkflows;
}

export {
    getAllWorkflows
}