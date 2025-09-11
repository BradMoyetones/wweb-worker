import { Workflow } from "@core/types/data";

export interface DataContextType {
    workflows: Workflow[];
    setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>
}