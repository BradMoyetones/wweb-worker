import { Link } from "react-router-dom";
import { WorkflowsDashboard } from "../components/WorkflowsDashboard";

// Mock data for demonstration
const mockWorkflows = [
  {
    id: "wf_001_alpha_prime",
    name: "Data Processing Pipeline",
    data: null,
    description: "Automated data ingestion and transformation workflow for real-time analytics processing.",
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: "wf_002_beta_nexus",
    name: "Email Campaign Automation",
    data: null,
    description: "Intelligent email marketing sequences with dynamic content personalization and A/B testing.",
    createdAt: Date.now() - 86400000 * 14, // 14 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    id: "wf_003_gamma_flux",
    name: "Inventory Management System",
    data: null,
    description: "Real-time inventory tracking with automated reordering and supplier notifications.",
    createdAt: Date.now() - 86400000 * 21, // 21 days ago
    updatedAt: null,
  },
  {
    id: "wf_004_delta_core",
    name: "Customer Support Bot",
    data: null,
    description: "AI-powered customer service automation with natural language processing and escalation protocols.",
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    id: "wf_005_epsilon_matrix",
    name: "Social Media Scheduler",
    data: null,
    description: "Multi-platform content scheduling with optimal timing algorithms and engagement analytics.",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    updatedAt: Date.now() - 86400000 * 3, // 3 days ago
  },
  {
    id: "wf_006_zeta_quantum",
    name: "Financial Report Generator",
    data: null,
    description: "Automated financial reporting with real-time data aggregation and compliance checking.",
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    updatedAt: Date.now() - 86400000 * 7, // 7 days ago
  },
]

export default function HomeWorkflows() {
    return (
        <div>
            <Link to={"/workflows/1"}>
                Prueba
            </Link>
            <WorkflowsDashboard workflows={mockWorkflows} />
        </div>
    )
}
