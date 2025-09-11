import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Edge, Node, ReactFlowInstance, NodeProps, NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { ApiNode, ButtonEdge, Controls, DecisionNode, EndNode, ProcessNode, Sidebar, StartNode } from './components/ReactFlow';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


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

export default function Workflows() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

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

    return (
        <div className="flex h-[calc(100vh-64px)] w-full">
            <Sidebar />
            <div className="flex-1">
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
        </div>
    )
}