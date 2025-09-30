"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Settings, Play, Pause, MoreVertical, Edit, Trash2, User } from "lucide-react"
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
import { Workflow, WorkflowPriorityEnum, WorkflowStatusEnum } from "@core/types/data"
import { getPriorityConfig, getStatusConfig } from "@/utils/workflowsHelper"

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

    const statusConfig = getStatusConfig(workflow.status as WorkflowStatusEnum)
    const priorityConfig = getPriorityConfig(workflow.priority as WorkflowPriorityEnum || WorkflowPriorityEnum.LOW)
    const StatusIcon = statusConfig.icon

    const progress = workflow.totalSteps > 0 ? (workflow.completedSteps / workflow.totalSteps) * 100 : 0

    let tags: string[] = []
    try {
        tags = workflow.tags ? JSON.parse(workflow.tags) : []
    } catch (error) {
        console.log("[v0] Error parsing workflow tags:", error)
        tags = []
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
                priorityConfig.border,
                workflow.priority === WorkflowPriorityEnum.CRITICAL && "workflow-card-glow",
                workflow.status === WorkflowStatusEnum.ACTIVE && "workflow-card-float",
            )}
        >
            <Meteors number={20} />
            <CardContent>
                <div className="relative space-y-4">
                    {/* Header with status and priority */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className={cn("w-3 h-3 rounded-full animate-pulse", statusConfig.color)} />
                                <Badge variant="secondary" className="text-xs font-mono">
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.text}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-balance group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                {workflow.name}
                            </h3>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
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

                    {/* Progress bar */}
                    {workflow.totalSteps > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-mono">
                                    {workflow.completedSteps}/{workflow.totalSteps}
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Created {formatDate(workflow.createdAt)}</span>
                        </div>
                        {workflow.updatedAt !== workflow.createdAt && (
                            <div className="flex items-center gap-1">
                                <Settings className="w-3 h-3" />
                                <span>Updated {formatDate(workflow.updatedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* Assigned user */}
                    {workflow.assignedTo && (
                        <div className="flex items-center gap-2 text-xs">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Assigned to:</span>
                            <Badge variant="outline" className="text-xs">
                                {workflow.assignedTo}
                            </Badge>
                        </div>
                    )}

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
                        {workflow.status === WorkflowStatusEnum.ACTIVE && (
                            <Button variant="outline" size="sm">
                                <Pause className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
