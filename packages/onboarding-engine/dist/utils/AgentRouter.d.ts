import { MasterPlan } from "../schemas/MasterPlanSchema";
export type AgentId = "websiteReviewer" | "webBuilder" | "legalCompliance" | "marketIntelligence" | "onboardingGuide" | "seoOptimizer" | "contentWriter";
export interface AgentTask {
    id: string;
    agentId: AgentId;
    prompt: string;
    context: Record<string, unknown>;
    priority: "low" | "medium" | "high" | "critical";
    status: "pending" | "in_progress" | "completed" | "failed";
    createdAt: string;
    completedAt?: string;
    result?: unknown;
}
export interface AgentResult {
    success: boolean;
    agentId: AgentId;
    taskId: string;
    output: string;
    metadata?: Record<string, unknown>;
    error?: string;
}
export declare function evaluateRoutingRules(plan: MasterPlan): AgentTask[];
export declare function getPendingAgentTasks(plan: MasterPlan): Array<{
    id: string;
    name: string;
    agentId: AgentId;
    priority: string;
    why: string;
}>;
export declare function simulateAgentTask(task: AgentTask): Promise<AgentResult>;
export declare function canProceedToPhase(currentPhase: number, targetPhase: number, plan: MasterPlan): {
    allowed: boolean;
    reason?: string;
};
//# sourceMappingURL=AgentRouter.d.ts.map