import { createContext, useEffect, useState } from "react";
import { Workflow } from "@core/types/data";
import { DataContextType } from "./DataContext.types";
import { initWorkflow } from "@/utils/workflowsHelper";
import { toast } from "sonner";

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [workflowSelected, setWorkflowSelected] = useState<Workflow | null>(null);
    const [loadingCreateWorkflow, setLoadingCreateWorkflow] = useState(false)

    const handleCrateWorkflow = async() => {
        setLoadingCreateWorkflow(true)
        const res = await initWorkflow()
        
        if(res){
            setLoadingCreateWorkflow(false)
            setWorkflows((prev) => [res, ...prev])
            return res
        }

        setLoadingCreateWorkflow(false)
        toast.error("Ocurrio un error al intentar crear el workflow")
        return res
    }
    
    const fetchData = async() => {
        const data = await window.api.getAllWorkflows()
        setWorkflows(data)
    }
    
    useEffect(() => {
        fetchData()
    },[])

    return (
        <DataContext.Provider 
            value={{ 
                workflows,
                setWorkflows,
                workflowSelected,
                setWorkflowSelected,
                loadingCreateWorkflow,
                handleCrateWorkflow
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

