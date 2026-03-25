export { MasterPlanSchema, Phase1LegalSchema, Phase2DigitalSchema, Phase3DepartmentsSchema, Phase4RoadmapSchema, MilestoneSchema, LLCStatusSchema, EINStatusSchema, OperatingAgreementStatusSchema, WebsitePlatformSchema, DomainStatusSchema, DepartmentStatusSchema, MilestoneStatusSchema, isPhase1Complete, getPhase1CompletionSummary, validateMasterPlan, } from "./schemas/MasterPlanSchema";
export { CA_LLC_DEFAULTS, REAL_ESTATE_AI_KPIS, SEO_DEFAULTS, AGENT_PROMPTS, TECH_STACK_DEFAULTS, MILESTONE_TEMPLATES, DEFAULT_MASTER_PLAN, getShadowValue, mergeWithDefaults, } from "./constants/business-defaults";
export { evaluateRoutingRules, simulateAgentTask, canProceedToPhase, getPendingAgentTasks, } from "./utils/AgentRouter";
export const PACKAGE_VERSION = "1.0.0";
export const PACKAGE_NAME = "@stragra/onboarding-engine";
//# sourceMappingURL=index.js.map