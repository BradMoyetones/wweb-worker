// drizzle/schema.ts
import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

/*  
=====================================================
 Tabla principal de Workflows
=====================================================
*/
export const workflows = sqliteTable("workflows", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),

    // Nombre amigable del workflow
    name: text("name").notNull(),

    // Opcional, descripción del workflow
    description: text("description"),

    // JSON del grafo/pasos
    data: text("data"),

    // Estados y control
    status: text("status").notNull().default("DRAFT"), // WorkflowStatus
    priority: text("priority").notNull().default("LOW"), // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

    // Ejecución
    startedAt: integer("started_at"), // timestamp
    completedAt: integer("completed_at"), // timestamp
    lastExecutedAt: integer("last_executed_at"), // timestamp
    nextScheduledAt: integer("next_scheduled_at"), // timestamp

    // Progreso
    currentStep: text("current_step"),
    totalSteps: integer("total_steps").notNull().default(0),
    completedSteps: integer("completed_steps").notNull().default(0),

    // Metadata
    createdBy: text("created_by").notNull().default("USER"),
    assignedTo: text("assigned_to").default("USER"), // usuario asignado
    tags: text("tags"), // JSON.stringify([...])

    // Auditoría
    createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
    updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),

    // Configuración
    timeout: integer("timeout"), // en minutos
    maxRetries: integer("max_retries").notNull().default(0),
    currentRetries: integer("current_retries").notNull().default(0),
});

/*  
=====================================================
 Tabla de ejecuciones de Workflows
=====================================================
*/
export const workflowExecutions = sqliteTable("workflow_executions", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),

    // FK al workflow principal
    workflowId: text("workflow_id")
        .notNull()
        .references(() => workflows.id, { onDelete: "cascade", onUpdate: "cascade" }),

    // Identificación de ejecución
    executionNumber: integer("execution_number").notNull(), // 1, 2, 3...
    triggeredBy: text("triggered_by").notNull(), // 'MANUAL' | 'SCHEDULED' | 'API' | 'WEBHOOK' | 'RETRY'
    triggeredByUserId: text("triggered_by_user_id"),

    // Estado de la ejecución
    status: text("status").notNull(), // ExecutionStatus
    startedAt: integer("started_at").notNull(),
    completedAt: integer("completed_at"),
    duration: integer("duration"), // en milisegundos

    // Progreso detallado
    currentStep: text("current_step"),
    stepsCompleted: text("steps_completed"), // JSON.stringify([...])
    stepsFailed: text("steps_failed"), // JSON.stringify([...])

    // Datos de ejecución
    inputData: text("input_data"), // JSON.stringify({...})
    outputData: text("output_data"), // JSON.stringify({...})
    errorMessage: text("error_message"),
    errorStep: text("error_step"),

    // Métricas
    retryCount: integer("retry_count").notNull().default(0),
    resourcesUsed: text("resources_used"), // JSON.stringify({...})

    // Metadata
    environment: text("environment").notNull(), // 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION'
    version: text("version").notNull(), // Versión del workflow al momento de ejecución

    createdAt: integer("created_at").$defaultFn(() => Date.now()),
    updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

/*  
=====================================================
 Tabla de ejecuciones de pasos de Workflow
=====================================================
*/
export const workflowStepExecutions = sqliteTable("workflow_step_executions", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),

    // FK a workflow_executions
    executionId: text("execution_id")
        .notNull()
        .references(() => workflowExecutions.id, { onDelete: "cascade", onUpdate: "cascade" }),

    // ID del paso en el grafo
    stepId: text("step_id").notNull(),
    stepName: text("step_name").notNull(),
    stepType: text("step_type").notNull(), // 'ACTION' | 'CONDITION' | 'LOOP' | 'PARALLEL' | 'HUMAN_TASK'

    // Estado de ejecución del paso
    status: text("status").notNull(), // 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED'
    startedAt: integer("started_at").notNull(),
    completedAt: integer("completed_at"),
    duration: integer("duration"), // ms

    // Datos
    inputData: text("input_data"), // JSON.stringify({...})
    outputData: text("output_data"), // JSON.stringify({...})
    errorMessage: text("error_message"),

    // Reintentos
    retryCount: integer("retry_count").notNull().default(0),

    createdAt: integer("created_at").$defaultFn(() => Date.now()),
});


/*  
=====================================================
 Relaciones entre tablas
=====================================================
*/
export const workflowsRelations = relations(workflows, ({ many }) => ({
    executions: many(workflowExecutions), // un workflow tiene muchas ejecuciones
}));

export const workflowExecutionsRelations = relations(workflowExecutions, ({ one, many }) => ({
    workflow: one(workflows, {
        fields: [workflowExecutions.workflowId],
        references: [workflows.id],
    }),
    steps: many(workflowStepExecutions), // una ejecución tiene muchos pasos
}));

export const workflowStepExecutionsRelations = relations(workflowStepExecutions, ({ one }) => ({
    execution: one(workflowExecutions, {
        fields: [workflowStepExecutions.executionId],
        references: [workflowExecutions.id],
    }),
}));