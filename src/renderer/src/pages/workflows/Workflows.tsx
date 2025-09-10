import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Edge, Node, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { Sidebar, Controls } from './components';
import { CustomNode } from './components';
import { ApiNode } from './components/ApiNode/ApiNode';


const nodeTypes = {
    custom: CustomNode,
    apiNode: ApiNode
}

const initialNodes: Node[] = [
    {
        id: "1",
        type: "custom",
        position: { x: 250, y: 100 },
        data: { label: "Nodo Inicial", type: "start" },
    },
    {
        id: "2",
        type: "custom",
        position: { x: 400, y: 200 },
        data: { label: "Proceso", type: "process" },
    },
    {
        id: "3",
        type: "custom",
        position: { x: 250, y: 300 },
        data: { label: "Decisión", type: "decision" },
    },
    {
        id: "4",
        type: "apiNode",
        position: { x: 250, y: 300 },
        data: { label: "Api", type: "api" },
    },
]

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
]

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
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
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
                type: "custom",
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
                    defaultEdgeOptions={{
                        animated: true,
                        style: { strokeDasharray: "5 5", stroke: "var(--primary)" },
                    }}
                    fitView
                >
                    <Background />
                    <Controls />
                    <MiniMap nodeColor="#10b981" maskColor="rgba(0, 0, 0, 0.1)" className="bg-card" />
                </ReactFlow>
            </div>
        </div>
    )
}