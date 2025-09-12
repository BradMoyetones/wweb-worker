import { Workflow } from "@core/types/data";

export interface DataContextType {
    workflows: Workflow[];
    setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;

    // Estado para el que se seleccione en la vista :id
    workflowSelected: Workflow | null;
    setWorkflowSelected: React.Dispatch<React.SetStateAction<Workflow | null>>;
}