import { InferSelectModel } from 'drizzle-orm';
import { workflowExecutions, workflows, workflowStepExecutions } from '@core/drizzle/schema';


// Prioridades
export enum WorkflowPriorityEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
}

// Tipos de trigger para ejecuciones
export enum TriggerTypeEnum {
    MANUAL = "MANUAL",
    SCHEDULED = "SCHEDULED",
    API = "API",
    WEBHOOK = "WEBHOOK",
    RETRY = "RETRY",
}

// Ambientes
export enum EnvironmentEnum {
    DEVELOPMENT = "DEVELOPMENT",
    STAGING = "STAGING",
    PRODUCTION = "PRODUCTION",
}

// Tipos de pasos
export enum StepTypeEnum {
    ACTION = "ACTION",
    CONDITION = "CONDITION",
    LOOP = "LOOP",
    PARALLEL = "PARALLEL",
    HUMAN_TASK = "HUMAN_TASK",
}

// Estados de pasos individuales
export enum StepStatusEnum {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
}

// Estados de workflow
export enum WorkflowStatusEnum {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    SCHEDULED = "SCHEDULED",
    TIMEOUT = "TIMEOUT",
    WAITING_APPROVAL = "WAITING_APPROVAL",
    RETRYING = "RETRYING",
    ARCHIVED = "ARCHIVED",
}

// Estados de ejecución
export enum ExecutionStatusEnum {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    TIMEOUT = "TIMEOUT",
    RETRYING = "RETRYING",
}

// Tipos Drizzle
export type Workflow = InferSelectModel<typeof workflows>;
export type WorkflowExecution = InferSelectModel<typeof workflowExecutions>;
export type WorkflowStepExecution = InferSelectModel<typeof workflowStepExecutions>;

