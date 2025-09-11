import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Settings, GitBranch, Database, MessageSquare, Zap, FileText, CheckCircle } from "lucide-react"

const nodeIcons = {
    start: Play,
    process: Settings,
    decision: GitBranch,
    end: CheckCircle,
    database: Database,
    api: Zap,
    notification: MessageSquare,
    document: FileText,
}

const nodeColors = {
    start: "bg-green-500",
    process: "bg-blue-500",
    decision: "bg-yellow-500",
    end: "bg-red-500",
    database: "bg-purple-500",
    api: "bg-orange-500",
    notification: "bg-indigo-500",
    document: "bg-gray-500",
}

export function CustomNode({ data, selected }: NodeProps & {data: any}) {
    const Icon = nodeIcons[data.type as keyof typeof nodeIcons] || Settings
    const colorClass = nodeColors[data.type as keyof typeof nodeColors] || "bg-gray-500"

    return (
        <Card className={`min-w-[150px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}>

            <div className="p-3">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{data.label}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                            {data.type}
                        </Badge>
                    </div>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="!size-2 !bg-primary"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!size-2 !bg-primary"
            />
        </Card>
    )
}
