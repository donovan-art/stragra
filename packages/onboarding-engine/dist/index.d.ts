export { MasterPlanSchema, Phase1LegalSchema, Phase2DigitalSchema, Phase3DepartmentsSchema, Phase4RoadmapSchema, MilestoneSchema, LLCStatusSchema, EINStatusSchema, OperatingAgreementStatusSchema, WebsitePlatformSchema, DomainStatusSchema, DepartmentStatusSchema, MilestoneStatusSchema, isPhase1Complete, getPhase1CompletionSummary, validateMasterPlan, } from "./schemas/MasterPlanSchema";
export type { MasterPlan, Phase1Legal, Phase2Digital, Phase3Departments, Phase4Roadmap, Milestone, } from "./schemas/MasterPlanSchema";
export { CA_LLC_DEFAULTS, REAL_ESTATE_AI_KPIS, SEO_DEFAULTS, AGENT_PROMPTS, TECH_STACK_DEFAULTS, MILESTONE_TEMPLATES, DEFAULT_MASTER_PLAN, getShadowValue, mergeWithDefaults, } from "./constants/business-defaults";
export { evaluateRoutingRules, simulateAgentTask, canProceedToPhase, getPendingAgentTasks, type AgentId, type AgentTask, type AgentResult, } from "./utils/AgentRouter";
export declare const PACKAGE_VERSION = "1.0.0";
export declare const PACKAGE_NAME = "@stragra/onboarding-engine";
//# sourceMappingURL=index.d.ts.map