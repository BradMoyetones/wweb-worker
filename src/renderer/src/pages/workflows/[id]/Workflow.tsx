import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Edge, Node, ReactFlowInstance, NodeProps, NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import { ApiNode, ButtonEdge, Controls, DecisionNode, EndNode, ProcessNode, Sidebar, StartNode } from './components/ReactFlow';
import { ArrowLeft, Loader, Plus, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Workflow } from '@core/types/data';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useData } from '@/contexts';


const nodeTypes = {
    api: withToolbar(ApiNode),
    start: withToolbar(StartNode),
    process: withToolbar(ProcessNode),
    decision: withToolbar(DecisionNode),
    end: withToolbar(EndNode),
}

const initialNodes: Node[] = [
    {
        id: "1",
        type: "start",
        position: { x: 200, y: 100 },
        data: { label: "Nodo Inicial", type: "start" },
    },
    {
        id: "2",
        type: "process",
        position: { x: 400, y: 100 },
        data: { label: "Proceso", type: "process" },
    },
    {
        id: "3",
        type: "decision",
        position: { x: 600, y: 100 },
        data: { label: "Decisión", type: "decision" },
    },
    {
        id: "4",
        type: "api",
        position: { x: 800, y: 100 },
        data: { label: "Api", type: "api" },
    },
    {
        id: "5",
        type: "end",
        position: { x: 1050, y: 100 },
        data: { label: "End", type: "end" },
    },
]

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", type: "buttonedge" },
    { id: "e2-3", source: "2", target: "3", type: "buttonedge" },
    { id: "e3-4", source: "3", target: "4", type: "buttonedge" },
    { id: "e4-5", source: "4", target: "5", type: "buttonedge" },
]

const edgeTypes = {
    buttonedge: ButtonEdge,
};
 

function withToolbar<T extends NodeProps>(
    WrappedNode: React.ComponentType<T>
) {
    return (props: T) => {
        const { deleteElements } = useReactFlow();

        const handleDelete = () => {
            deleteElements({ nodes: [{ id: props.id }] }); // borra solo este nodo
        };

        return (
            <>
                <NodeToolbar 
                    position={Position.Bottom} 
                    className='nopan nodrag'
                    isVisible={props.selected}
                >
                    <Button 
                        size={"icon"} 
                        variant={"destructive"}
                        onClick={handleDelete}
                    >
                        <Trash2 />
                    </Button>
                </NodeToolbar>
                <WrappedNode {...props} />
            </>
        );
    }
}

export default function WorkflowPage() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const {workflowSelected, setWorkflowSelected, handleCrateWorkflow, loadingCreateWorkflow} = useData()
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const {id} = useParams()
    const [loadingFetch, setLoadingFetch] = useState(false)
    const router = useNavigate()

    const fetchWorkflow = async(id: string) => {
        setLoadingFetch(true)
        const res: Workflow | null = await window.api.findWorkflowById(id)
        setLoadingFetch(false)
        setWorkflowSelected(res)
    }

    useEffect(() => {
        setWorkflowSelected(null)
        if(id){
            fetchWorkflow(id)
        }
    }, [id])

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge({...params, type: "buttonedge"}, edgesSnapshot)),
        [],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            const type = event.dataTransfer.getData("application/reactflow")
            const label = event.dataTransfer.getData("application/reactflow-label")

            if (typeof type === "undefined" || !type || !reactFlowInstance) {
                return
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            })

            const newNode: Node = {
                id: `${Date.now()}`,
                type,
                position,
                data: { label, type },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance, setNodes],
    )

    

    if(loadingFetch){
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='flex-col flex items-center justify-center gap-2'>
                    <Zap size={40} />
                    <h1
                        className='text-2xl flex gap-2 items-center'
                    >
                        Cargando Workflow
                        <Loader className="animate-spin" />
                    </h1>
                </div>
            </div>
        )
    }

    if(!workflowSelected && !loadingFetch){
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='flex-col flex items-center justify-center gap-2'>
                    <Zap size={40} />
                    <h1
                        className='text-2xl'
                    >
                        Este workflow no fue encontrado
                    </h1>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant={"outline"}
                        >
                            <ArrowLeft /> Volver al Dashboard
                        </Button>
                        <Button
                            onClick={async() => {
                                const res = await handleCrateWorkflow()
                                if(res){
                                    router(`/workflows/${res.id}`, {viewTransition: true})
                                }
                            }}
                        >
                            Crear Nuevo
                            {loadingCreateWorkflow ? (<Loader className="animate-spin" />) : (<Plus className="w-4 h-4 mr-2" />)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider
            style={
                {
                "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
        >
            <Sidebar className='top-[64px] h-[calc(100vh-64px)]' />
            <SidebarInset className='h-[calc(100vh-64px)]'>
                <div className="flex-1 relative">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger className="absolute top-4 left-4 z-10" />
                        </TooltipTrigger>
                        <TooltipContent
                            side='right'
                        >
                            <p>Toggle Sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        defaultEdgeOptions={{
                            animated: true,
                            style: { strokeDasharray: "5 5", stroke: "var(--primary)" },
                        }}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap 
                            nodeColor="var(--primary)" 
                            maskColor="rgba(0, 0, 0, 0.5)" 
                            className="!bg-card" 
                        />
                    </ReactFlow>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}