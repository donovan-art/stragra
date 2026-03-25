import { z } from "zod";
export const LLCStatusSchema = z.enum([
    "not_started",
    "name_reserved",
    "articles_filed",
    "approved",
    "active",
]);
export const EINStatusSchema = z.enum([
    "not_applied",
    "applied",
    "received",
]);
export const OperatingAgreementStatusSchema = z.enum([
    "not_created",
    "draft",
    "signed",
    "notarized",
]);
export const Phase1LegalSchema = z.object({
    llcName: z.string().min(1).max(100).optional()
        .describe("Desired LLC name (must be unique in California)"),
    llcStatus: LLCStatusSchema.default("not_started")
        .describe("Current status of LLC formation"),
    articlesOfOrganizationFiled: z.boolean().default(false)
        .describe("Articles of Organization filed with CA Secretary of State"),
    filingNumber: z.string().optional()
        .describe("CA SOS filing number (if approved)"),
    registeredAgentService: z.enum([
        "self",
        "northwest",
        "legalzoom",
        "harbor_compliance",
        "other",
    ]).default("self").describe("Registered agent service provider"),
    registeredAgentAddress: z.string().optional(),
    einStatus: EINStatusSchema.default("not_applied"),
    einNumber: z.string().regex(/^\d{2}-\d{7}$/).optional()
        .describe("EIN format: XX-XXXXXXX"),
    operatingAgreementStatus: OperatingAgreementStatusSchema.default("not_created"),
    operatingAgreementTemplate: z.enum([
        "single_member",
        "multi_member",
        "manager_managed",
        "custom",
    ]).default("single_member"),
    caStatementOfInformationFiled: z.boolean().default(false)
        .describe("CA Form LLC-12 filed within 90 days"),
    caFranchiseTaxAccountCreated: z.boolean().default(false)
        .describe("CA Franchise Tax Board account created"),
    businessBankAccountOpened: z.boolean().default(false),
    bankName: z.string().optional(),
    generalLiabilityInsurance: z.boolean().default(false),
    e_oInsurance: z.boolean().default(false)
        .describe("Errors & Omissions insurance for AI services"),
    _requiredCompleted: z.boolean().default(false)
        .describe("Internal flag: all Phase 1 required fields complete"),
});
export const WebsitePlatformSchema = z.enum([
    "existing",
    "webflow",
    "framer",
    "wordpress",
    "nextjs_custom",
    "shopify",
    "squarespace",
    "wix",
    "none",
]);
export const DomainStatusSchema = z.enum([
    "not_purchased",
    "purchased_unconfigured",
    "dns_configured",
    "ssl_active",
]);
export const Phase2DigitalSchema = z.object({
    websiteUrl: z.string().url().optional()
        .describe("Existing website URL (if any)"),
    websitePlatform: WebsitePlatformSchema.default("none"),
    useWebBuilder: z.boolean().default(false)
        .describe("Flag to trigger WebBuilderAgent"),
    primaryDomain: z.string().regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i).optional()
        .describe("Primary domain (e.g., stragra.ai)"),
    domainStatus: DomainStatusSchema.default("not_purchased"),
    domainRegistrar: z.enum([
        "namecheap",
        "google_domains",
        "cloudflare",
        "godaddy",
        "porkbun",
        "other",
    ]).optional(),
    professionalEmailSetup: z.boolean().default(false),
    emailProvider: z.enum([
        "google_workspace",
        "microsoft_365",
        "zoho",
        "proton",
        "other",
    ]).optional(),
    logoStatus: z.enum([
        "not_created",
        "diy",
        "freelancer",
        "agency",
        "finalized",
    ]).default("not_created"),
    brandColors: z.object({
        primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    }).optional(),
    linkedinUrl: z.string().url().optional(),
    twitterHandle: z.string().optional(),
    instagramHandle: z.string().optional(),
    googleAnalyticsConnected: z.boolean().default(false),
    googleSearchConsoleConnected: z.boolean().default(false),
});
export const DepartmentStatusSchema = z.enum([
    "disabled",
    "planning",
    "mvp",
    "operational",
    "scaling",
]);
export const Phase3DepartmentsSchema = z.object({
    sales: z.object({
        enabled: z.boolean().default(true),
        status: DepartmentStatusSchema.default("planning"),
        headcount: z.number().int().min(0).default(0),
        crmPlatform: z.enum([
            "hubspot",
            "salesforce",
            "pipedrive",
            "close",
            "none",
        ]).default("none"),
    }),
    marketing: z.object({
        enabled: z.boolean().default(true),
        status: DepartmentStatusSchema.default("planning"),
        headcount: z.number().int().min(0).default(0),
        focus: z.array(z.enum([
            "content",
            "seo",
            "paid_ads",
            "social",
            "events",
            "partnerships",
        ])).default(["content", "seo"]),
    }),
    operations: z.object({
        enabled: z.boolean().default(true),
        status: DepartmentStatusSchema.default("planning"),
        headcount: z.number().int().min(0).default(0),
        tools: z.array(z.enum([
            "notion",
            "asana",
            "monday",
            "clickup",
            "linear",
            "custom",
        ])).default(["notion"]),
    }),
    customerSuccess: z.object({
        enabled: z.boolean().default(true),
        status: DepartmentStatusSchema.default("planning"),
        headcount: z.number().int().min(0).default(0),
        helpdeskPlatform: z.enum([
            "zendesk",
            "intercom",
            "crisp",
            "freshdesk",
            "none",
        ]).default("none"),
    }),
    engineering: z.object({
        enabled: z.boolean().default(true),
        status: DepartmentStatusSchema.default("planning"),
        headcount: z.number().int().min(0).default(1),
        techStack: z.array(z.string()).default([
            "Next.js",
            "TypeScript",
            "OpenAI API",
            "Supabase",
        ]),
    }),
});
export const MilestoneStatusSchema = z.enum([
    "not_started",
    "in_progress",
    "blocked",
    "completed",
    "cancelled",
]);
export const MilestoneSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string(),
    targetDate: z.string().datetime().optional(),
    status: MilestoneStatusSchema.default("not_started"),
    owner: z.string().optional(),
    dependencies: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
});
export const Phase4RoadmapSchema = z.object({
    daily: z.array(MilestoneSchema).default([])
        .describe("Daily execution milestones (next 7 days)"),
    weekly: z.array(MilestoneSchema).default([])
        .describe("Weekly goals (next 4 weeks)"),
    monthly: z.array(MilestoneSchema).default([])
        .describe("Monthly objectives (next 6 months)"),
    quarterly: z.array(MilestoneSchema).default([])
        .describe("Quarterly targets (next 4 quarters)"),
    yearly: z.array(MilestoneSchema).default([])
        .describe("Annual goals (5 year horizon)"),
    northStarMetric: z.string().default("Monthly Recurring Revenue (MRR)"),
    currentPhase: z.enum([
        "discovery",
        "validation",
        "efficiency",
        "scale",
    ]).default("discovery"),
});
export const MasterPlanSchema = z.object({
    clientId: z.string().default("001-stragra"),
    clientName: z.string().default("Stragra"),
    createdAt: z.string().datetime().default(() => new Date().toISOString()),
    updatedAt: z.string().datetime().default(() => new Date().toISOString()),
    version: z.string().default("1.0.0"),
    phase1Legal: Phase1LegalSchema.default({}),
    phase2Digital: Phase2DigitalSchema.default({}),
    phase3Departments: Phase3DepartmentsSchema.default({
        sales: { enabled: true, status: "planning", headcount: 0, crmPlatform: "none" },
        marketing: { enabled: true, status: "planning", headcount: 0, focus: ["content", "seo"] },
        operations: { enabled: true, status: "planning", headcount: 0, tools: ["notion"] },
        customerSuccess: { enabled: true, status: "planning", headcount: 0, helpdeskPlatform: "none" },
        engineering: { enabled: true, status: "planning", headcount: 1, techStack: ["Next.js", "TypeScript", "OpenAI API", "Supabase"] },
    }),
    phase4Roadmap: Phase4RoadmapSchema.default({}),
    currentPhase: z.number().int().min(1).max(4).default(1),
    completedPhases: z.array(z.number()).default([]),
    activeAgents: z.array(z.string()).default([]),
    completedAgentTasks: z.array(z.string()).default([]),
});
export function isPhase1Complete(plan) {
    const p1 = plan.phase1Legal;
    return (!!p1.llcName &&
        p1.llcStatus === "active" &&
        p1.einStatus === "received" &&
        p1.operatingAgreementStatus === "signed" &&
        p1.caStatementOfInformationFiled &&
        p1.caFranchiseTaxAccountCreated);
}
export function getPhase1CompletionSummary(plan) {
    const p1 = plan.phase1Legal;
    const required = [
        { field: "LLC Name", value: !!p1.llcName },
        { field: "LLC Status Active", value: p1.llcStatus === "active" },
        { field: "EIN Received", value: p1.einStatus === "received" },
        { field: "Operating Agreement Signed", value: p1.operatingAgreementStatus === "signed" },
        { field: "CA Statement of Information", value: p1.caStatementOfInformationFiled },
        { field: "CA Franchise Tax Account", value: p1.caFranchiseTaxAccountCreated },
    ];
    const complete = required.filter(r => r.value).length;
    const missing = required.filter(r => !r.value).map(r => r.field);
    return {
        complete: missing.length === 0,
        percentage: Math.round((complete / required.length) * 100),
        missing,
    };
}
export function validateMasterPlan(data) {
    const result = MasterPlanSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
//# sourceMappingURL=MasterPlanSchema.js.map