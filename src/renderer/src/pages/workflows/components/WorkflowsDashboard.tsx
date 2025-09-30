"use client"

import { Badge } from "@/components/ui/badge"
import { WorkflowCard } from "./WorkflowCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useData } from "@/contexts"
import { formatDate, getPriorityConfig, getStatusConfig } from "@/utils/workflowsHelper"
import { Workflow, WorkflowPriorityEnum, WorkflowStatusEnum } from "@core/types/data"
import { Plus, Search, Filter, Grid3X3, List, Zap, Loader, Clock, Settings, User, Play, MoreVertical, Edit, Trash2, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ViewMode = "grid" | "list"
type SortOption = "newest" | "oldest" | "name" | "updated" | "priority"
type FilterOption = "all" | WorkflowStatusEnum
type PriorityFilter = "all" | WorkflowPriorityEnum

export function WorkflowsDashboard() {
    const router = useNavigate()
    const {workflows, handleCrateWorkflow, loadingCreateWorkflow} = useData()

    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [filterBy, setFilterBy] = useState<FilterOption>("all")
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")

    const filteredAndSortedWorkflows = useMemo(() => {
        const filtered = workflows.filter((workflow) => {
            const matchesSearch =
                workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workflow.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workflow.tags?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = filterBy === "all" || workflow.status === filterBy
            const matchesPriority = priorityFilter === "all" || workflow.priority === priorityFilter

            return matchesSearch && matchesStatus && matchesPriority
        })

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return b.createdAt - a.createdAt
                case "oldest":
                    return a.createdAt - b.createdAt
                case "name":
                    return a.name.localeCompare(b.name)
                case "updated":
                    return b.updatedAt - a.updatedAt
                case "priority":
                    const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
                    return priorityOrder[b.priority] - priorityOrder[a.priority]
                default:
                return 0
            }
        })

        return filtered
    }, [workflows, searchQuery, sortBy, filterBy, priorityFilter])

    const WorkflowListItem = ({ workflow }: { workflow: Workflow }) => {
        const statusConfig = getStatusConfig(workflow.status as WorkflowStatusEnum)
        const priorityConfig = getPriorityConfig(workflow.priority as WorkflowPriorityEnum)
        const StatusIcon = statusConfig.icon
        const progress = workflow.totalSteps > 0 ? (workflow.completedSteps / workflow.totalSteps) * 100 : 0

        return (
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full animate-pulse", statusConfig.color)} />
                                <Badge variant="secondary" className="text-xs font-mono">
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.text}
                                </Badge>
                                <Badge className={cn("text-xs", priorityConfig.color, priorityConfig.bg)}>{workflow.priority}</Badge>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                    {workflow.name}
                                </h3>
                                {workflow.description && (
                                    <p className="text-sm text-muted-foreground truncate mt-1">{workflow.description}</p>
                                )}
                                {workflow.totalSteps > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 bg-muted rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {workflow.completedSteps}/{workflow.totalSteps}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
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
                                {workflow.assignedTo && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{workflow.assignedTo}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 text-sm px-3 py-1"
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    Execute
                                </HoverBorderGradient>

                                <Button variant="outline" size="sm">
                                    <Zap className="w-3 h-3" />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router(`/workflows/${workflow.id}`, {viewTransition: true})}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const stats = useMemo(() => {
        const statusCounts = workflows.reduce(
        (acc, workflow) => {
            acc[workflow.status] = (acc[workflow.status] || 0) + 1
            return acc
        },
        {} as Record<WorkflowStatusEnum, number>,
        )

        return [
            { label: "Total Workflows", value: workflows.length, color: "bg-blue-500" },
            { label: "Active", value: statusCounts[WorkflowStatusEnum.ACTIVE] || 0, color: "bg-emerald-500" },
            { label: "Completed", value: statusCounts[WorkflowStatusEnum.COMPLETED] || 0, color: "bg-green-500" },
            { label: "Failed", value: statusCounts[WorkflowStatusEnum.FAILED] || 0, color: "bg-red-500" },
        ]
    }, [workflows])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-border/50">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative container mx-auto px-6 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-4xl font-black text-balance text-primary">
                                    Workflow Command Center
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg">
                                {"Manage your automated processes with futuristic precision"}
                            </p>
                        </div>
                        <Button
                            size="lg"
                            onClick={async() => {
                                const res = await handleCrateWorkflow()
                                if(res){
                                    router(`/workflows/${res.id}`, {viewTransition: true})
                                }
                            }}
                            disabled={loadingCreateWorkflow}
                        >
                            {loadingCreateWorkflow ? (<Loader className="animate-spin" />) : (<Plus className="w-4 h-4 mr-2" />)}
                            Create Workflow
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:bg-card/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                                </div>
                                <span className="text-2xl font-bold">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2/5 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workflows by name, description, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card/50 border-border/50 focus:bg-card focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Status: {filterBy === "all" ? "All" : getStatusConfig(filterBy as WorkflowStatusEnum).text}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterBy("all")} className={filterBy === "all" ? "bg-accent" : ""}>
                                    All Workflows
                                </DropdownMenuItem>
                                {Object.values(WorkflowStatusEnum).map((status) => {
                                    const config = getStatusConfig(status)
                                    const StatusIcon = config.icon
                                    return (
                                        <DropdownMenuItem
                                            key={status}
                                            onClick={() => setFilterBy(status)}
                                            className={filterBy === status ? "bg-accent" : ""}
                                        >
                                            <StatusIcon className="w-4 h-4 mr-2" />
                                            {config.text}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setPriorityFilter("all")}
                                    className={priorityFilter === "all" ? "bg-accent" : ""}
                                >
                                    All Priorities
                                </DropdownMenuItem>
                                {Object.values(WorkflowPriorityEnum).map((priority) => {
                                    const config = getPriorityConfig(priority)
                                    return (
                                        <DropdownMenuItem
                                            key={priority}
                                            onClick={() => setPriorityFilter(priority)}
                                            className={cn(priorityFilter === priority ? "bg-accent" : "", config.color)}
                                        >
                                        {priority}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Sort:{" "}
                                    {sortBy === "newest"
                                        ? "Newest"
                                        : sortBy === "oldest"
                                        ? "Oldest"
                                        : sortBy === "name"
                                            ? "Name"
                                            : sortBy === "updated"
                                            ? "Updated"
                                            : "Priority"}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[
                                    { value: "newest", label: "Newest First" },
                                    { value: "oldest", label: "Oldest First" },
                                    { value: "name", label: "Name A-Z" },
                                    { value: "updated", label: "Recently Updated" },
                                    { value: "priority", label: "Priority" },
                                ].map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setSortBy(option.value as SortOption)}
                                        className={sortBy === option.value ? "bg-accent" : ""}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <div className="flex gap-1 border rounded-md p-1">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                className="px-2"
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                                className="px-2"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {(searchQuery || filterBy !== "all" || priorityFilter !== "all") && (
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                            Found {filteredAndSortedWorkflows.length} workflow{filteredAndSortedWorkflows.length !== 1 ? "s" : ""}
                            {searchQuery && ` matching "${searchQuery}"`}
                            {filterBy !== "all" && ` with status "${getStatusConfig(filterBy as WorkflowStatusEnum).text}"`}
                            {priorityFilter !== "all" && ` with priority "${priorityFilter}"`}
                        </p>
                    </div>
                )}

                {/* Workflows Grid */}
                {filteredAndSortedWorkflows.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {workflows.map((workflow, index) => (
                                <WorkflowCard key={workflow.id} workflow={workflow} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAndSortedWorkflows.map((workflow) => (
                                <WorkflowListItem key={workflow.id} workflow={workflow} />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            {searchQuery || filterBy !== "all" || priorityFilter !== "all" ? (
                                <Search className="w-12 h-12 text-primary/50" />
                            ) : (
                                <Zap className="w-12 h-12 text-primary/50" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery || filterBy !== "all" || priorityFilter !== "all"
                                ? "No workflows found"
                                : "No workflows yet"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery || filterBy !== "all" || priorityFilter !== "all"
                                ? "No workflows match your current filters. Try adjusting your search terms or filters."
                                : "Create your first workflow to get started with automation"}
                        </p>
                        {!(searchQuery || filterBy !== "all" || priorityFilter !== "all") && (
                            <Button
                                onClick={async () => {
                                    const res = await handleCrateWorkflow()
                                    if (res) {
                                        router(`/workflows/${res.id}`, {viewTransition: true})
                                    }
                                }}
                                disabled={loadingCreateWorkflow}
                            >
                                {loadingCreateWorkflow ? (
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                Create Your First Workflow
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
