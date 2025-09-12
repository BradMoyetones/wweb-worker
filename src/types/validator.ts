import { z } from "zod";
import { WorkflowPriorityEnum, WorkflowStatusEnum } from "./data";

export const workflowSchema = z.object({
    id: z.string().uuid().optional(),

    name: z.string().min(1).default(() => `Draft - ${Date.now()}`),
    description: z.string().nullable().optional(),
    data: z.string().nullable().optional(),

    // usamos tus tipos directamente
    status: z.nativeEnum(WorkflowStatusEnum).default(WorkflowStatusEnum.DRAFT),

    priority: z.nativeEnum(WorkflowPriorityEnum).default(WorkflowPriorityEnum.LOW),

    startedAt: z.number().nullable().optional(),
    completedAt: z.number().nullable().optional(),
    lastExecutedAt: z.number().nullable().optional(),
    nextScheduledAt: z.number().nullable().optional(),

    currentStep: z.string().nullable().optional(),
    totalSteps: z.number().default(0),
    completedSteps: z.number().default(0),

    createdBy: z.string().default("USER"),
    assignedTo: z.string().nullable().optional(),
    tags: z.string().nullable().optional(),

    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().default(() => Date.now()),

    timeout: z.number().nullable().optional(),
    maxRetries: z.number().default(0),
    currentRetries: z.number().default(0),
});

export type WorkflowInput = z.infer<typeof workflowSchema>;
