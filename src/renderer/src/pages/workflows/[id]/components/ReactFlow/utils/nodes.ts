import { CheckCircle, GitBranch, Play, Settings, Zap } from "lucide-react"

const nodeIcons = {
    start: Play,
    process: Settings,
    decision: GitBranch,
    api: Zap,
    end: CheckCircle,
}

const nodeColors = {
    start: "bg-green-500",
    process: "bg-blue-500",
    decision: "bg-yellow-500",
    api: "bg-orange-500",
    end: "bg-red-500",
}

export {
    nodeIcons,
    nodeColors
}