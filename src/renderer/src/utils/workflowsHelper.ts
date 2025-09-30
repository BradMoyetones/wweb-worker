import { Workflow, WorkflowPriorityEnum, WorkflowStatusEnum } from "@core/types/data";
import { AlertTriangle, Archive, CheckCircle, Clock, Edit, Loader, Pause, Play, Timer, User, X } from "lucide-react";

const initWorkflow = async () => {
    try {
        const res: Workflow = await window.api.createWorkflow({
            name: `Draft - ${Date.now()}`,
        });

        return res ?? null; // si por alguna razón no retorna nada
    } catch (err) {
        console.error("❌ Error creating workflow:", err);
        return null;
    }
};

const getStatusConfig = (status: WorkflowStatusEnum) => {
    const configs = {
        [WorkflowStatusEnum.DRAFT]: { color: "bg-gray-500", icon: Edit, text: "Draft" },
        [WorkflowStatusEnum.ACTIVE]: { color: "bg-emerald-500", icon: Play, text: "Active" },
        [WorkflowStatusEnum.PAUSED]: { color: "bg-yellow-500", icon: Pause, text: "Paused" },
        [WorkflowStatusEnum.COMPLETED]: { color: "bg-green-500", icon: CheckCircle, text: "Completed" },
        [WorkflowStatusEnum.FAILED]: { color: "bg-red-500", icon: AlertTriangle, text: "Failed" },
        [WorkflowStatusEnum.CANCELLED]: { color: "bg-gray-400", icon: X, text: "Cancelled" },
        [WorkflowStatusEnum.SCHEDULED]: { color: "bg-blue-500", icon: Timer, text: "Scheduled" },
        [WorkflowStatusEnum.TIMEOUT]: { color: "bg-orange-500", icon: Clock, text: "Timeout" },
        [WorkflowStatusEnum.WAITING_APPROVAL]: { color: "bg-purple-500", icon: User, text: "Waiting Approval" },
        [WorkflowStatusEnum.RETRYING]: { color: "bg-amber-500", icon: Loader, text: "Retrying" },
        [WorkflowStatusEnum.ARCHIVED]: { color: "bg-slate-500", icon: Archive, text: "Archived" },
    }
    return configs[status] || configs[WorkflowStatusEnum.DRAFT]
}

const getPriorityConfig = (priority: WorkflowPriorityEnum) => {
    const configs = {
        [WorkflowPriorityEnum.LOW]: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
        [WorkflowPriorityEnum.MEDIUM]: {
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
        },
        [WorkflowPriorityEnum.HIGH]: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        [WorkflowPriorityEnum.CRITICAL]: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    }
    return configs[priority] || configs[WorkflowPriorityEnum.LOW] // Added fallback to prevent undefined
}

const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Unknown"
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export {
    initWorkflow,
    getStatusConfig,
    formatDate,
    getPriorityConfig
}