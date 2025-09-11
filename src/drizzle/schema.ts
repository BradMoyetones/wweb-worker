// drizzle/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';

// Tablas base
export const workflows = sqliteTable("workflows", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),
    name: text("name").notNull(), // Nombre amigable del workflow
    description: text("description"), // Opcional, descripción del workflow
    data: text("data"), // JSON.stringify({ nodes, edges, meta })
    createdAt: integer("created_at").$defaultFn(
        () => Date.now()
    ),
    updatedAt: integer("updated_at").$defaultFn(
        () => Date.now()
    ),
});