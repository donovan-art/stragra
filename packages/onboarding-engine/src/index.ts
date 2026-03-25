/**
 * @stragra/onboarding-engine
 * 
 * Master Plan Onboarding Engine for Client #001 (Stragra)
 * California AI Agency setup wizard with sequential validation gates.
 */

// ============================================================================
// Schemas
// ============================================================================

export {
  // Main schema
  MasterPlanSchema,
  
  // Phase schemas
  Phase1LegalSchema,
  Phase2DigitalSchema,
  Phase3DepartmentsSchema,
  Phase4RoadmapSchema,
  MilestoneSchema,
  
  // Enum schemas
  LLCStatusSchema,
  EINStatusSchema,
  OperatingAgreementStatusSchema,
  WebsitePlatformSchema,
  DomainStatusSchema,
  DepartmentStatusSchema,
  MilestoneStatusSchema,
  
  // Validation helpers
  isPhase1Complete,
  getPhase1CompletionSummary,
  validateMasterPlan,
} from "./schemas/MasterPlanSchema";

// Type exports
export type {
  MasterPlan,
  Phase1Legal,
  Phase2Digital,
  Phase3Departments,
  Phase4Roadmap,
  Milestone,
} from "./schemas/MasterPlanSchema";

// ============================================================================
// Constants / Business Defaults
// ============================================================================

export {
  // California LLC defaults
  CA_LLC_DEFAULTS,
  
  // Real estate KPIs
  REAL_ESTATE_AI_KPIS,
  
  // SEO defaults
  SEO_DEFAULTS,
  
  // Agent prompts
  AGENT_PROMPTS,
  
  // Tech stack recommendations
  TECH_STACK_DEFAULTS,
  
  // Milestone templates
  MILESTONE_TEMPLATES,
  
  // Complete default plan
  DEFAULT_MASTER_PLAN,
  
  // Utility functions
  getShadowValue,
  mergeWithDefaults,
} from "./constants/business-defaults";

// ============================================================================
// Agent Router
// ============================================================================

export {
  // Core functions
  evaluateRoutingRules,
  simulateAgentTask,
  canProceedToPhase,
  getPendingAgentTasks,
  
  // Types
  type AgentId,
  type AgentTask,
  type AgentResult,
} from "./utils/AgentRouter";

// ============================================================================
// Package Metadata
// ============================================================================

export const PACKAGE_VERSION = "1.0.0";
export const PACKAGE_NAME = "@stragra/onboarding-engine";
