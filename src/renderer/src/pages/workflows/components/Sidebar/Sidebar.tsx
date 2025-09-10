"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Settings, GitBranch, Database, MessageSquare, Zap, FileText, CheckCircle } from "lucide-react"

const nodeCategories = [
    {
        title: "Básicos",
        nodes: [
            { type: "start", label: "Inicio", icon: Play, color: "bg-green-500" },
            { type: "process", label: "Proceso", icon: Settings, color: "bg-blue-500" },
            { type: "decision", label: "Decisión", icon: GitBranch, color: "bg-yellow-500" },
            { type: "end", label: "Fin", icon: CheckCircle, color: "bg-red-500" },
        ],
    },
    {
        title: "Avanzados",
        nodes: [
            { type: "database", label: "Base de Datos", icon: Database, color: "bg-purple-500" },
            { type: "api", label: "API Call", icon: Zap, color: "bg-orange-500" },
            { type: "notification", label: "Notificación", icon: MessageSquare, color: "bg-indigo-500" },
            { type: "document", label: "Documento", icon: FileText, color: "bg-gray-500" },
        ],
    },
]

export function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType)
        event.dataTransfer.setData("application/reactflow-label", label)
        event.dataTransfer.effectAllowed = "move"
    }

    return (
        <div className="w-64 bg-sidebar border-r border-sidebar-border p-4 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">Editor de Flujo</h2>
                <p className="text-sm text-sidebar-foreground/70">Arrastra los nodos al área de trabajo</p>
            </div>

            <div className="space-y-6">
                {nodeCategories.map((category) => (
                    <div key={category.title}>
                        <h3 className="text-sm font-medium text-sidebar-foreground mb-3">{category.title}</h3>
                        <div className="space-y-2">
                            {category.nodes.map((node) => {
                                const Icon = node.icon
                                return (
                                    <Card
                                        key={node.type}
                                        className="p-3 cursor-grab active:cursor-grabbing hover:bg-sidebar-accent transition-colors border-sidebar-border"
                                        draggable
                                        onDragStart={(event) => onDragStart(event, node.type, node.label)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-md ${node.color} flex items-center justify-center`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-sidebar-foreground">{node.label}</div>
                                                <Badge variant="secondary" className="text-xs mt-1">
                                                    {node.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
