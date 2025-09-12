"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Settings, Play, Pause, MoreVertical, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Meteors } from "@/components/ui/meteors"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Workflow } from "@core/types/data"

interface WorkflowCardProps {
    workflow: Workflow
    index: number
}

export function WorkflowCard({ workflow, index }: WorkflowCardProps) {
    const router = useNavigate()
    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return "Unknown"
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const getStatusColor = (index: number) => {
        const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"]
        return colors[index % colors.length]
    }

    const getStatusText = (index: number) => {
        const statuses = ["Active", "Pending", "Completed", "Draft"]
        return statuses[index % statuses.length]
    }

    return (
        <Card
            className={cn(
                "group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105",
                "bg-gradient-to-br from-card via-card to-muted/30",
                "hover:shadow-2xl hover:shadow-primary/20",
                "workflow-card-pulse",
                index % 3 === 0 && "workflow-card-glow",
                index % 2 === 0 && "workflow-card-float",
            )}
        >
            <Meteors number={20} />
            <CardContent>
                <div className="relative space-y-4">
                    {/* Header with status */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full animate-pulse", getStatusColor(index))} />
                                <Badge variant="secondary" className="text-xs font-mono">
                                    {getStatusText(index)}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-balance group-hover:text-primary transition-colors duration-300">
                                {workflow.name}
                            </h3>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => router(`/workflows/${workflow.id}`, {viewTransition: true})}
                                >
                                    <Edit />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {}}
                                    variant="destructive"
                                >
                                    <Trash2 />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </div>

                    {/* Description */}
                    {workflow.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{workflow.description}</p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Created {formatDate(workflow.createdAt)}</span>
                        </div>
                        {workflow.updatedAt && workflow.updatedAt !== workflow.createdAt && (
                            <div className="flex items-center gap-1">
                                <Settings className="w-3 h-3" />
                                <span>Updated {formatDate(workflow.updatedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                        >
                            <Play className="w-3 h-3 mr-1" />
                            Execute
                        </HoverBorderGradient>
                        <Button variant="outline" size="sm">
                            <Zap className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                            <Pause className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
