import { ArrowLeft, CheckCircle, GitBranch, GripVertical, Play, Settings, Zap } from "lucide-react"

import {
    Sidebar as SidebarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

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
            { type: "api", label: "API Call", icon: Zap, color: "bg-orange-500" },
        ],
    },
]

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
    const {workflowSelected} = useData()

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType)
        event.dataTransfer.setData("application/reactflow-label", label)
        event.dataTransfer.effectAllowed = "move"
    }

    if(!workflowSelected) return

    return (
        <SidebarComponent variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/workflows" viewTransition>
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <ArrowLeft className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Volver a Dashboard</span>
                                    <span className="opacity-70 text-xs">Work Space</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
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
                                                    <GripVertical className="text-accent-foreground size-5" />
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button className="w-full">
                    Save
                </Button>
            </SidebarFooter>
        </SidebarComponent>
    )
}
