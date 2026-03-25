/**
 * Agent Router
 * 
 * Routes tasks to appropriate AI agents based on Master Plan state.
 * Implements conditional logic: websiteUrl → WebsiteReviewer, !websiteUrl → WebBuilderAgent
 */

import {
  MasterPlan,
  isPhase1Complete,
} from "../schemas/MasterPlanSchema";
import { AGENT_PROMPTS } from "../constants/business-defaults";

// ============================================================================
// Agent Types
// ============================================================================

export type AgentId = 
  | "websiteReviewer"
  | "webBuilder"
  | "legalCompliance"
  | "marketIntelligence"
  | "onboardingGuide"
  | "seoOptimizer"
  | "contentWriter";

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

// ============================================================================
// Routing Rules
// ============================================================================

interface RoutingRule {
  id: string;
  name: string;
  condition: (plan: MasterPlan) => boolean;
  agentId: AgentId;
  priority: AgentTask["priority"];
  generatePrompt: (plan: MasterPlan) => string;
  generateContext: (plan: MasterPlan) => Record<string, unknown>;
}

const ROUTING_RULES: RoutingRule[] = [
  {
    id: "website-review",
    name: "Website Review",
    condition: (plan) => {
      // Trigger if websiteUrl exists and hasn't been reviewed yet
      const hasUrl = !!plan.phase2Digital.websiteUrl;
      const alreadyReviewed = plan.completedAgentTasks.includes("website-review");
      return hasUrl && !alreadyReviewed;
    },
    agentId: "websiteReviewer",
    priority: "high",
    generatePrompt: (plan) => {
      const url = plan.phase2Digital.websiteUrl;
      return `${AGENT_PROMPTS.websiteReviewer}

Please analyze the following real estate website:
URL: ${url}

Focus on:
1. How well does it communicate AI value proposition?
2. Lead capture effectiveness
3. SEO optimization for real estate keywords
4. Mobile experience
5. Integration opportunities for Stragra's AI

Provide specific, actionable recommendations.`;
    },
    generateContext: (plan) => ({
      websiteUrl: plan.phase2Digital.websiteUrl,
      clientName: plan.clientName,
      clientId: plan.clientId,
    }),
  },
  
  {
    id: "web-builder",
    name: "Web Builder Planning",
    condition: (plan) => {
      // Trigger if useWebBuilder is true and no websiteUrl exists
      const wantsBuilder = plan.phase2Digital.useWebBuilder;
      const hasNoUrl = !plan.phase2Digital.websiteUrl;
      const alreadyPlanned = plan.completedAgentTasks.includes("web-builder");
      return wantsBuilder && hasNoUrl && !alreadyPlanned;
    },
    agentId: "webBuilder",
    priority: "high",
    generatePrompt: (plan) => {
      return `${AGENT_PROMPTS.webBuilder}

Create a comprehensive website architecture for:
Client: ${plan.clientName} (${plan.clientId})
Business Type: California AI-Powered Real Estate Agency

Requirements:
- Must generate leads for real estate agents
- Showcase AI capabilities prominently
- Include property search/matching features
- Integrate with CRM (${plan.phase3Departments.sales.crmPlatform})
- Support for neighborhood-specific pages
- Blog for SEO content marketing

Deliverables:
1. Site map with all pages
2. Wireframe descriptions for key pages
3. Component specifications
4. Recommended tech stack
5. Implementation timeline`;
    },
    generateContext: (plan) => ({
      clientName: plan.clientName,
      clientId: plan.clientId,
      crmPlatform: plan.phase3Departments.sales.crmPlatform,
      marketingFocus: plan.phase3Departments.marketing.focus,
    }),
  },
  
  {
    id: "legal-compliance-check",
    name: "Legal Compliance Review",
    condition: (plan) => {
      // Trigger when Phase 1 is started but not complete
      const phase1Started = plan.phase1Legal.llcStatus !== "not_started";
      const phase1Complete = isPhase1Complete(plan);
      const alreadyChecked = plan.completedAgentTasks.includes("legal-compliance-check");
      return phase1Started && !phase1Complete && !alreadyChecked;
    },
    agentId: "legalCompliance",
    priority: "critical",
    generatePrompt: (plan) => {
      return `${AGENT_PROMPTS.legalCompliance}

Review the current legal setup for:
Client: ${plan.clientName}

Current Status:
- LLC Status: ${plan.phase1Legal.llcStatus}
- EIN Status: ${plan.phase1Legal.einStatus}
- Operating Agreement: ${plan.phase1Legal.operatingAgreementStatus}
- CA Statement of Information: ${plan.phase1Legal.caStatementOfInformationFiled ? "Filed" : "Not Filed"}
- CA Franchise Tax: ${plan.phase1Legal.caFranchiseTaxAccountCreated ? "Account Created" : "Not Created"}

Identify:
1. Any missing compliance requirements
2. Upcoming deadlines
3. Recommended next actions
4. Potential risks`;
    },
    generateContext: (plan) => ({
      phase1Status: plan.phase1Legal,
      clientName: plan.clientName,
    }),
  },
  
  {
    id: "market-intelligence-setup",
    name: "Market Intelligence Setup",
    condition: (plan) => {
      // Trigger when departments are being set up
      const departmentsEnabled = Object.values(plan.phase3Departments)
        .some((d: { enabled: boolean; status: string }) => d.enabled && d.status === "planning");
      const alreadySetup = plan.completedAgentTasks.includes("market-intelligence-setup");
      return departmentsEnabled && !alreadySetup;
    },
    agentId: "marketIntelligence",
    priority: "medium",
    generatePrompt: (plan) => {
      return `${AGENT_PROMPTS.marketIntelligence}

Set up market intelligence infrastructure for:
Client: ${plan.clientName}
Target Markets: California (start with Bay Area, expand to LA/SD)

Initial Analysis Needed:
1. Top 10 neighborhoods for AI real estate services
2. Competition analysis (who else uses AI in these markets)
3. Data source integration plan (MLS feeds, public records)
4. KPI benchmarks specific to these markets

Deliver a 90-day data collection and analysis plan.`;
    },
    generateContext: (plan) => ({
      clientName: plan.clientName,
      departments: plan.phase3Departments,
    }),
  },
  
  {
    id: "seo-optimization",
    name: "SEO Strategy",
    condition: (plan) => {
      // Trigger when website is being built
      const buildingSite = plan.phase2Digital.useWebBuilder || 
        !!plan.phase2Digital.websiteUrl;
      const marketingEnabled = plan.phase3Departments.marketing.enabled;
      const alreadyOptimized = plan.completedAgentTasks.includes("seo-optimization");
      return buildingSite && marketingEnabled && !alreadyOptimized;
    },
    agentId: "seoOptimizer",
    priority: "medium",
    generatePrompt: (plan) => {
      return `You are Stragra's SEO Specialist Agent.

Create a comprehensive SEO strategy for:
Client: ${plan.clientName}
Website: ${plan.phase2Digital.websiteUrl || "New Build"}

Requirements:
1. Keyword research for "AI real estate" + California cities
2. Content calendar for first 3 months
3. Technical SEO checklist
4. Local SEO for target cities
5. Backlink acquisition strategy

Focus on high-intent keywords that convert.`;
    },
    generateContext: (plan) => ({
      websiteUrl: plan.phase2Digital.websiteUrl,
      primaryDomain: plan.phase2Digital.primaryDomain,
      clientName: plan.clientName,
    }),
  },
  
  {
    id: "onboarding-welcome",
    name: "Welcome Guide",
    condition: (plan) => {
      // Always trigger for new plans
      const isNew = plan.completedPhases.length === 0 && 
        plan.completedAgentTasks.length === 0;
      return isNew;
    },
    agentId: "onboardingGuide",
    priority: "high",
    generatePrompt: (plan) => {
      return `${AGENT_PROMPTS.onboardingGuide}

Generate a personalized welcome message for:
Client: ${plan.clientName}
Current Phase: ${plan.currentPhase}

Include:
1. Warm welcome and congratulations on starting
2. Overview of the Master Plan journey (4 phases)
3. What to expect in Phase 1 (Legal/Entity)
4. Quick wins they can achieve this week
5. How to get help if stuck

Keep it encouraging, professional, and actionable.`;
    },
    generateContext: (plan) => ({
      clientName: plan.clientName,
      currentPhase: plan.currentPhase,
    }),
  },
];

// ============================================================================
// Router Functions
// ============================================================================

/**
 * Evaluates all routing rules against the current Master Plan
 * Returns list of tasks that should be triggered
 */
export function evaluateRoutingRules(plan: MasterPlan): AgentTask[] {
  const triggeredTasks: AgentTask[] = [];
  
  for (const rule of ROUTING_RULES) {
    if (rule.condition(plan)) {
      triggeredTasks.push({
        id: rule.id,
        agentId: rule.agentId,
        prompt: rule.generatePrompt(plan),
        context: rule.generateContext(plan),
        priority: rule.priority,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  triggeredTasks.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  
  return triggeredTasks;
}

/**
 * Gets a human-readable list of what agents would be triggered
 */
export function getPendingAgentTasks(plan: MasterPlan): Array<{
  id: string;
  name: string;
  agentId: AgentId;
  priority: string;
  why: string;
}> {
  const triggered = ROUTING_RULES.filter(rule => rule.condition(plan));
  
  return triggered.map(rule => ({
    id: rule.id,
    name: rule.name,
    agentId: rule.agentId,
    priority: rule.priority,
    why: getTriggerReason(rule.id, plan),
  }));
}

function getTriggerReason(ruleId: string, plan: MasterPlan): string {
  switch (ruleId) {
    case "website-review":
      return `Website URL provided (${plan.phase2Digital.websiteUrl}) - ready for analysis`;
    case "web-builder":
      return "No website exists - architecting new build";
    case "legal-compliance-check":
      return "LLC formation in progress - checking compliance gaps";
    case "market-intelligence-setup":
      return "Departments being configured - setting up market data";
    case "seo-optimization":
      return "Website + Marketing enabled - creating SEO strategy";
    case "onboarding-welcome":
      return "New client onboarding - sending welcome guide";
    default:
      return "Condition met";
  }
}

/**
 * Simulates running an agent task (placeholder for actual AI integration)
 */
export async function simulateAgentTask(
  task: AgentTask
): Promise<AgentResult> {
  console.log(`[AgentRouter] Running ${task.agentId} for task ${task.id}`);
  
  // In production, this would call your AI provider (OpenAI, Anthropic, etc.)
  // For now, simulate a successful response
  
  const simulatedOutputs: Record<AgentId, string> = {
    websiteReviewer: `Website Analysis Complete for ${task.context.websiteUrl}

Overall Score: 72/100

Critical Issues:
- Missing AI value proposition above the fold
- No clear lead capture on homepage
- Mobile navigation broken

Quick Wins:
- Add "Powered by AI" badge to hero
- Implement exit-intent popup
- Compress images (2.3MB → 400KB)

Strategic Recommendations:
- Create neighborhood-specific landing pages
- Add chatbot with property search integration
- Implement mortgage calculator for lead gen

AI Enhancement Roadmap:
Week 1: Install tracking
Week 2: A/B test headlines  
Week 3: Implement chatbot
Week 4: Launch retargeting`,

    webBuilder: `Web Builder Architecture for ${task.context.clientName}

SITE MAP:
/
├── /about
├── /services
│   ├── /services/ai-property-matching
│   ├── /services/lead-generation
│   └── /services/market-intelligence
├── /neighborhoods
│   ├── /neighborhoods/[city]
│   └── /neighborhoods/[city]/[neighborhood]
├── /blog
├── /contact
└── /demo

TECH STACK:
- Next.js 14 + TypeScript
- Tailwind + shadcn/ui
- Supabase (auth, db, storage)
- OpenAI API (chatbot)
- Framer Motion (animations)

IMPLEMENTATION TIMELINE:
Week 1: Setup + Design System
Week 2: Core Pages
Week 3: AI Integration
Week 4: Testing + Launch`,

    legalCompliance: `Legal Compliance Review

IMMEDIATE ACTION REQUIRED:
⚠️ File Form LLC-12 within 45 days to avoid penalties
⚠️ Create CA Franchise Tax account before first tax year

UPCOMING DEADLINES:
- LLC-12: ${new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- First Estimated Tax: 04/15/${new Date().getFullYear() + 1}

RECOMMENDED NEXT ACTIONS:
1. Complete Operating Agreement (use template)
2. Open business bank account (Chase, Mercury, or Relay)
3. Apply for E&O insurance (Hiscox or Embroker)
4. Set up QuickBooks for bookkeeping

RISK ASSESSMENT: MEDIUM
- No critical blockers
- Timeline is manageable
- Budget $2,500 for legal/compliance Year 1`,

    marketIntelligence: `Market Intelligence Setup Plan

TARGET MARKETS (Priority Order):
1. San Francisco Bay Area
2. Los Angeles Metro  
3. San Diego County

DATA SOURCES TO INTEGRATE:
✓ CRMLS (California Regional MLS)
✓ Public Records APIs
✓ Census/Demographic Data
✓ Zillow API (market trends)
✓ Google Places API (amenities)

90-DAY ROADMAP:
Days 1-30: Data pipeline setup
Days 31-60: Initial analysis models
Days 61-90: Dashboard + alerting

KEY METRICS TO TRACK:
- Days on Market (DOM) by zip
- Price per sqft trends
- Inventory levels
- Seasonal patterns`,

    onboardingGuide: `Welcome to Stragra, ${task.context.clientName}! 🎉

You're about to transform how real estate gets done in California. 

YOUR MASTER PLAN JOURNEY:
Phase 1: Legal Foundation (You're here!) 
Phase 2: Digital Presence
Phase 3: Team & Operations  
Phase 4: Growth Roadmap

THIS WEEK'S QUICK WINS:
☐ Reserve your LLC name
☐ Choose a registered agent
☐ Open a business bank account

YOU'RE NOT ALONE:
Every step has pre-loaded defaults based on successful AI agencies. You can customize everything, but you don't have to start from scratch.

Questions? Just ask. I'm here to guide you.

— Your Stragra Onboarding Agent`,

    seoOptimizer: `SEO Strategy for ${task.context.clientName}

HIGH-INTENT KEYWORDS:
Primary: "AI real estate agent California"
Secondary: "property matching AI", "real estate automation"
Long-tail: "best AI tools for realtors Bay Area"

CONTENT CALENDAR (First 3 Months):
Month 1: Foundation
- 4 blog posts: AI in real estate series
- Neighborhood guides for top 5 cities
- Pillar page: "Complete Guide to AI Real Estate"

Month 2: Authority
- Case studies (even hypothetical)
- Guest posts on Inman, HousingWire
- Video content optimization

Month 3: Conversion
- Landing pages for each service
- Comparison pages (vs traditional methods)
- Downloadable resources (lead magnets)

TECHNICAL CHECKLIST:
☐ Core Web Vitals < 2.5s
☐ Mobile-first indexing
☐ Schema markup (LocalBusiness, Service)
☐ XML sitemap submitted
☐ Robots.txt optimized`,

    contentWriter: "Content generated successfully.",
  };

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    success: true,
    agentId: task.agentId,
    taskId: task.id,
    output: simulatedOutputs[task.agentId] || `Task ${task.id} completed by ${task.agentId}`,
    metadata: {
      processingTime: 1000,
      tokensUsed: Math.floor(Math.random() * 2000) + 500,
    },
  };
}

/**
 * Determines if a phase transition is allowed
 */
export function canProceedToPhase(
  currentPhase: number,
  targetPhase: number,
  plan: MasterPlan
): { allowed: boolean; reason?: string } {
  // Can always go backwards
  if (targetPhase <= currentPhase) {
    return { allowed: true };
  }
  
  // Sequential gate: must complete current phase before proceeding
  switch (currentPhase) {
    case 1:
      if (!isPhase1Complete(plan)) {
        const summary = getPhase1CompletionSummary(plan);
        return {
          allowed: false,
          reason: `Phase 1 incomplete (${summary.percentage}%). Missing: ${summary.missing.join(", ")}`,
        };
      }
      break;
    
    case 2:
      // Phase 2 completion: has website URL or is building one
      const hasWeb = !!plan.phase2Digital.websiteUrl || plan.phase2Digital.useWebBuilder;
      if (!hasWeb) {
        return {
          allowed: false,
          reason: "Phase 2 incomplete: Need website URL or enable Web Builder",
        };
      }
      break;
    
    case 3:
      // Phase 3 completion: at least one department enabled
      const hasDept = Object.values(plan.phase3Departments)
        .some((d: { enabled: boolean }) => d.enabled);
      if (!hasDept) {
        return {
          allowed: false,
          reason: "Phase 3 incomplete: Enable at least one department",
        };
      }
      break;
  }
  
  return { allowed: true };
}

// Import for the function above
import { getPhase1CompletionSummary } from "../schemas/MasterPlanSchema";
