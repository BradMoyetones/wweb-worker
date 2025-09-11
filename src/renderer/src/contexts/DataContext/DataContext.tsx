import { createContext, useEffect, useState } from "react";
import { Workflow } from "@core/types/data";
import { DataContextType } from "./DataContext.types";

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    
    const fetchData = async() => {
        const data = await window.api.getAllWorkflows()
        console.log(data);
        
        setWorkflows(data)
    }
    
    useEffect(() => {
        fetchData()
    },[])

    return (
        <DataContext.Provider 
            value={{ 
                workflows,
                setWorkflows
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

