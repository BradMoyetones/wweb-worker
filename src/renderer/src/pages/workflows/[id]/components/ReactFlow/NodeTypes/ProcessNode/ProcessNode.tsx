import { nodeColors, nodeIcons } from '../../utils/nodes'
import { Card } from '@/components/ui/card'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { Badge } from '@/components/ui/badge'

export function ProcessNode({ data, selected }: NodeProps & {data: any}) {
    const Icon = nodeIcons["process"]
    const colorClass = nodeColors["process"]

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
