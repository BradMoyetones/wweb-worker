"use client"

import { WorkflowCard } from "./WorkflowCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Grid3X3, List, Zap } from "lucide-react"

type Workflow = {
    id: string
    name: string
    data: string | null
    description: string | null
    createdAt: number | null
    updatedAt: number | null
}

interface WorkflowsDashboardProps {
    workflows: Workflow[]
}

export function WorkflowsDashboard({ workflows }: WorkflowsDashboardProps) {
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
                    <h1 className="text-4xl font-black text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Workflow Command Center
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    {"Manage your automated processes with futuristic precision"}
                </p>
                </div>
                <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                { label: "Total Workflows", value: workflows.length, color: "bg-emerald-500" },
                { label: "Active", value: Math.floor(workflows.length * 0.6), color: "bg-blue-500" },
                { label: "Completed", value: Math.floor(workflows.length * 0.3), color: "bg-purple-500" },
                { label: "Draft", value: Math.floor(workflows.length * 0.1), color: "bg-orange-500" },
                ].map((stat, index) => (
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                placeholder="Search workflows..."
                className="pl-10 bg-card/50 border-border/50 focus:bg-card focus:border-primary/50 transition-all"
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                </Button>
                <Button variant="outline" size="sm">
                <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                <List className="w-4 h-4" />
                </Button>
            </div>
            </div>

            {/* Workflows Grid */}
            {workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workflows.map((workflow, index) => (
                <WorkflowCard key={workflow.id} workflow={workflow} index={index} />
                ))}
            </div>
            ) : (
            <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Zap className="w-12 h-12 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
                <p className="text-muted-foreground mb-6">{"Create your first workflow to get started with automation"}</p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
                </Button>
            </div>
            )}
        </div>
        </div>
    )
}
