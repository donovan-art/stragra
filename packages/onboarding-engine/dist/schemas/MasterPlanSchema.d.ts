import { z } from "zod";
export declare const LLCStatusSchema: z.ZodEnum<["not_started", "name_reserved", "articles_filed", "approved", "active"]>;
export declare const EINStatusSchema: z.ZodEnum<["not_applied", "applied", "received"]>;
export declare const OperatingAgreementStatusSchema: z.ZodEnum<["not_created", "draft", "signed", "notarized"]>;
export declare const Phase1LegalSchema: z.ZodObject<{
    llcName: z.ZodOptional<z.ZodString>;
    llcStatus: z.ZodDefault<z.ZodEnum<["not_started", "name_reserved", "articles_filed", "approved", "active"]>>;
    articlesOfOrganizationFiled: z.ZodDefault<z.ZodBoolean>;
    filingNumber: z.ZodOptional<z.ZodString>;
    registeredAgentService: z.ZodDefault<z.ZodEnum<["self", "northwest", "legalzoom", "harbor_compliance", "other"]>>;
    registeredAgentAddress: z.ZodOptional<z.ZodString>;
    einStatus: z.ZodDefault<z.ZodEnum<["not_applied", "applied", "received"]>>;
    einNumber: z.ZodOptional<z.ZodString>;
    operatingAgreementStatus: z.ZodDefault<z.ZodEnum<["not_created", "draft", "signed", "notarized"]>>;
    operatingAgreementTemplate: z.ZodDefault<z.ZodEnum<["single_member", "multi_member", "manager_managed", "custom"]>>;
    caStatementOfInformationFiled: z.ZodDefault<z.ZodBoolean>;
    caFranchiseTaxAccountCreated: z.ZodDefault<z.ZodBoolean>;
    businessBankAccountOpened: z.ZodDefault<z.ZodBoolean>;
    bankName: z.ZodOptional<z.ZodString>;
    generalLiabilityInsurance: z.ZodDefault<z.ZodBoolean>;
    e_oInsurance: z.ZodDefault<z.ZodBoolean>;
    _requiredCompleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    llcStatus: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active";
    articlesOfOrganizationFiled: boolean;
    registeredAgentService: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other";
    einStatus: "not_applied" | "applied" | "received";
    operatingAgreementStatus: "not_created" | "draft" | "signed" | "notarized";
    operatingAgreementTemplate: "single_member" | "multi_member" | "manager_managed" | "custom";
    caStatementOfInformationFiled: boolean;
    caFranchiseTaxAccountCreated: boolean;
    businessBankAccountOpened: boolean;
    generalLiabilityInsurance: boolean;
    e_oInsurance: boolean;
    _requiredCompleted: boolean;
    llcName?: string | undefined;
    filingNumber?: string | undefined;
    registeredAgentAddress?: string | undefined;
    einNumber?: string | undefined;
    bankName?: string | undefined;
}, {
    llcName?: string | undefined;
    llcStatus?: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active" | undefined;
    articlesOfOrganizationFiled?: boolean | undefined;
    filingNumber?: string | undefined;
    registeredAgentService?: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other" | undefined;
    registeredAgentAddress?: string | undefined;
    einStatus?: "not_applied" | "applied" | "received" | undefined;
    einNumber?: string | undefined;
    operatingAgreementStatus?: "not_created" | "draft" | "signed" | "notarized" | undefined;
    operatingAgreementTemplate?: "single_member" | "multi_member" | "manager_managed" | "custom" | undefined;
    caStatementOfInformationFiled?: boolean | undefined;
    caFranchiseTaxAccountCreated?: boolean | undefined;
    businessBankAccountOpened?: boolean | undefined;
    bankName?: string | undefined;
    generalLiabilityInsurance?: boolean | undefined;
    e_oInsurance?: boolean | undefined;
    _requiredCompleted?: boolean | undefined;
}>;
export declare const WebsitePlatformSchema: z.ZodEnum<["existing", "webflow", "framer", "wordpress", "nextjs_custom", "shopify", "squarespace", "wix", "none"]>;
export declare const DomainStatusSchema: z.ZodEnum<["not_purchased", "purchased_unconfigured", "dns_configured", "ssl_active"]>;
export declare const Phase2DigitalSchema: z.ZodObject<{
    websiteUrl: z.ZodOptional<z.ZodString>;
    websitePlatform: z.ZodDefault<z.ZodEnum<["existing", "webflow", "framer", "wordpress", "nextjs_custom", "shopify", "squarespace", "wix", "none"]>>;
    useWebBuilder: z.ZodDefault<z.ZodBoolean>;
    primaryDomain: z.ZodOptional<z.ZodString>;
    domainStatus: z.ZodDefault<z.ZodEnum<["not_purchased", "purchased_unconfigured", "dns_configured", "ssl_active"]>>;
    domainRegistrar: z.ZodOptional<z.ZodEnum<["namecheap", "google_domains", "cloudflare", "godaddy", "porkbun", "other"]>>;
    professionalEmailSetup: z.ZodDefault<z.ZodBoolean>;
    emailProvider: z.ZodOptional<z.ZodEnum<["google_workspace", "microsoft_365", "zoho", "proton", "other"]>>;
    logoStatus: z.ZodDefault<z.ZodEnum<["not_created", "diy", "freelancer", "agency", "finalized"]>>;
    brandColors: z.ZodOptional<z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        secondary: z.ZodOptional<z.ZodString>;
        accent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
    }, {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
    }>>;
    linkedinUrl: z.ZodOptional<z.ZodString>;
    twitterHandle: z.ZodOptional<z.ZodString>;
    instagramHandle: z.ZodOptional<z.ZodString>;
    googleAnalyticsConnected: z.ZodDefault<z.ZodBoolean>;
    googleSearchConsoleConnected: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    websitePlatform: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none";
    useWebBuilder: boolean;
    domainStatus: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active";
    professionalEmailSetup: boolean;
    logoStatus: "not_created" | "diy" | "freelancer" | "agency" | "finalized";
    googleAnalyticsConnected: boolean;
    googleSearchConsoleConnected: boolean;
    websiteUrl?: string | undefined;
    primaryDomain?: string | undefined;
    domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
    emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
    brandColors?: {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
    } | undefined;
    linkedinUrl?: string | undefined;
    twitterHandle?: string | undefined;
    instagramHandle?: string | undefined;
}, {
    websiteUrl?: string | undefined;
    websitePlatform?: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none" | undefined;
    useWebBuilder?: boolean | undefined;
    primaryDomain?: string | undefined;
    domainStatus?: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active" | undefined;
    domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
    professionalEmailSetup?: boolean | undefined;
    emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
    logoStatus?: "not_created" | "diy" | "freelancer" | "agency" | "finalized" | undefined;
    brandColors?: {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
    } | undefined;
    linkedinUrl?: string | undefined;
    twitterHandle?: string | undefined;
    instagramHandle?: string | undefined;
    googleAnalyticsConnected?: boolean | undefined;
    googleSearchConsoleConnected?: boolean | undefined;
}>;
export declare const DepartmentStatusSchema: z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>;
export declare const Phase3DepartmentsSchema: z.ZodObject<{
    sales: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
        headcount: z.ZodDefault<z.ZodNumber>;
        crmPlatform: z.ZodDefault<z.ZodEnum<["hubspot", "salesforce", "pipedrive", "close", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        crmPlatform: "none" | "hubspot" | "salesforce" | "pipedrive" | "close";
    }, {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        crmPlatform?: "none" | "hubspot" | "salesforce" | "pipedrive" | "close" | undefined;
    }>;
    marketing: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
        headcount: z.ZodDefault<z.ZodNumber>;
        focus: z.ZodDefault<z.ZodArray<z.ZodEnum<["content", "seo", "paid_ads", "social", "events", "partnerships"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        focus: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[];
    }, {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        focus?: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[] | undefined;
    }>;
    operations: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
        headcount: z.ZodDefault<z.ZodNumber>;
        tools: z.ZodDefault<z.ZodArray<z.ZodEnum<["notion", "asana", "monday", "clickup", "linear", "custom"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        tools: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[];
    }, {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        tools?: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[] | undefined;
    }>;
    customerSuccess: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
        headcount: z.ZodDefault<z.ZodNumber>;
        helpdeskPlatform: z.ZodDefault<z.ZodEnum<["zendesk", "intercom", "crisp", "freshdesk", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        helpdeskPlatform: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk";
    }, {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        helpdeskPlatform?: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk" | undefined;
    }>;
    engineering: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
        headcount: z.ZodDefault<z.ZodNumber>;
        techStack: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        techStack: string[];
    }, {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        techStack?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    sales: {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        crmPlatform: "none" | "hubspot" | "salesforce" | "pipedrive" | "close";
    };
    marketing: {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        focus: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[];
    };
    operations: {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        tools: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[];
    };
    customerSuccess: {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        helpdeskPlatform: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk";
    };
    engineering: {
        status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
        enabled: boolean;
        headcount: number;
        techStack: string[];
    };
}, {
    sales: {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        crmPlatform?: "none" | "hubspot" | "salesforce" | "pipedrive" | "close" | undefined;
    };
    marketing: {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        focus?: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[] | undefined;
    };
    operations: {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        tools?: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[] | undefined;
    };
    customerSuccess: {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        helpdeskPlatform?: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk" | undefined;
    };
    engineering: {
        status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
        enabled?: boolean | undefined;
        headcount?: number | undefined;
        techStack?: string[] | undefined;
    };
}>;
export declare const MilestoneStatusSchema: z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>;
export declare const MilestoneSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    targetDate: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
    owner: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
    id: string;
    title: string;
    description: string;
    dependencies: string[];
    deliverables: string[];
    targetDate?: string | undefined;
    owner?: string | undefined;
}, {
    id: string;
    title: string;
    description: string;
    status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
    targetDate?: string | undefined;
    owner?: string | undefined;
    dependencies?: string[] | undefined;
    deliverables?: string[] | undefined;
}>;
export declare const Phase4RoadmapSchema: z.ZodObject<{
    daily: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        targetDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
        owner: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }>, "many">>;
    weekly: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        targetDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
        owner: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }>, "many">>;
    monthly: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        targetDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
        owner: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }>, "many">>;
    quarterly: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        targetDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
        owner: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }>, "many">>;
    yearly: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        targetDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
        owner: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }>, "many">>;
    northStarMetric: z.ZodDefault<z.ZodString>;
    currentPhase: z.ZodDefault<z.ZodEnum<["discovery", "validation", "efficiency", "scale"]>>;
}, "strip", z.ZodTypeAny, {
    daily: {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }[];
    weekly: {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }[];
    monthly: {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }[];
    quarterly: {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }[];
    yearly: {
        status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        deliverables: string[];
        targetDate?: string | undefined;
        owner?: string | undefined;
    }[];
    northStarMetric: string;
    currentPhase: "validation" | "discovery" | "efficiency" | "scale";
}, {
    daily?: {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }[] | undefined;
    weekly?: {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }[] | undefined;
    monthly?: {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }[] | undefined;
    quarterly?: {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }[] | undefined;
    yearly?: {
        id: string;
        title: string;
        description: string;
        status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
        targetDate?: string | undefined;
        owner?: string | undefined;
        dependencies?: string[] | undefined;
        deliverables?: string[] | undefined;
    }[] | undefined;
    northStarMetric?: string | undefined;
    currentPhase?: "validation" | "discovery" | "efficiency" | "scale" | undefined;
}>;
export declare const MasterPlanSchema: z.ZodObject<{
    clientId: z.ZodDefault<z.ZodString>;
    clientName: z.ZodDefault<z.ZodString>;
    createdAt: z.ZodDefault<z.ZodString>;
    updatedAt: z.ZodDefault<z.ZodString>;
    version: z.ZodDefault<z.ZodString>;
    phase1Legal: z.ZodDefault<z.ZodObject<{
        llcName: z.ZodOptional<z.ZodString>;
        llcStatus: z.ZodDefault<z.ZodEnum<["not_started", "name_reserved", "articles_filed", "approved", "active"]>>;
        articlesOfOrganizationFiled: z.ZodDefault<z.ZodBoolean>;
        filingNumber: z.ZodOptional<z.ZodString>;
        registeredAgentService: z.ZodDefault<z.ZodEnum<["self", "northwest", "legalzoom", "harbor_compliance", "other"]>>;
        registeredAgentAddress: z.ZodOptional<z.ZodString>;
        einStatus: z.ZodDefault<z.ZodEnum<["not_applied", "applied", "received"]>>;
        einNumber: z.ZodOptional<z.ZodString>;
        operatingAgreementStatus: z.ZodDefault<z.ZodEnum<["not_created", "draft", "signed", "notarized"]>>;
        operatingAgreementTemplate: z.ZodDefault<z.ZodEnum<["single_member", "multi_member", "manager_managed", "custom"]>>;
        caStatementOfInformationFiled: z.ZodDefault<z.ZodBoolean>;
        caFranchiseTaxAccountCreated: z.ZodDefault<z.ZodBoolean>;
        businessBankAccountOpened: z.ZodDefault<z.ZodBoolean>;
        bankName: z.ZodOptional<z.ZodString>;
        generalLiabilityInsurance: z.ZodDefault<z.ZodBoolean>;
        e_oInsurance: z.ZodDefault<z.ZodBoolean>;
        _requiredCompleted: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        llcStatus: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active";
        articlesOfOrganizationFiled: boolean;
        registeredAgentService: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other";
        einStatus: "not_applied" | "applied" | "received";
        operatingAgreementStatus: "not_created" | "draft" | "signed" | "notarized";
        operatingAgreementTemplate: "single_member" | "multi_member" | "manager_managed" | "custom";
        caStatementOfInformationFiled: boolean;
        caFranchiseTaxAccountCreated: boolean;
        businessBankAccountOpened: boolean;
        generalLiabilityInsurance: boolean;
        e_oInsurance: boolean;
        _requiredCompleted: boolean;
        llcName?: string | undefined;
        filingNumber?: string | undefined;
        registeredAgentAddress?: string | undefined;
        einNumber?: string | undefined;
        bankName?: string | undefined;
    }, {
        llcName?: string | undefined;
        llcStatus?: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active" | undefined;
        articlesOfOrganizationFiled?: boolean | undefined;
        filingNumber?: string | undefined;
        registeredAgentService?: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other" | undefined;
        registeredAgentAddress?: string | undefined;
        einStatus?: "not_applied" | "applied" | "received" | undefined;
        einNumber?: string | undefined;
        operatingAgreementStatus?: "not_created" | "draft" | "signed" | "notarized" | undefined;
        operatingAgreementTemplate?: "single_member" | "multi_member" | "manager_managed" | "custom" | undefined;
        caStatementOfInformationFiled?: boolean | undefined;
        caFranchiseTaxAccountCreated?: boolean | undefined;
        businessBankAccountOpened?: boolean | undefined;
        bankName?: string | undefined;
        generalLiabilityInsurance?: boolean | undefined;
        e_oInsurance?: boolean | undefined;
        _requiredCompleted?: boolean | undefined;
    }>>;
    phase2Digital: z.ZodDefault<z.ZodObject<{
        websiteUrl: z.ZodOptional<z.ZodString>;
        websitePlatform: z.ZodDefault<z.ZodEnum<["existing", "webflow", "framer", "wordpress", "nextjs_custom", "shopify", "squarespace", "wix", "none"]>>;
        useWebBuilder: z.ZodDefault<z.ZodBoolean>;
        primaryDomain: z.ZodOptional<z.ZodString>;
        domainStatus: z.ZodDefault<z.ZodEnum<["not_purchased", "purchased_unconfigured", "dns_configured", "ssl_active"]>>;
        domainRegistrar: z.ZodOptional<z.ZodEnum<["namecheap", "google_domains", "cloudflare", "godaddy", "porkbun", "other"]>>;
        professionalEmailSetup: z.ZodDefault<z.ZodBoolean>;
        emailProvider: z.ZodOptional<z.ZodEnum<["google_workspace", "microsoft_365", "zoho", "proton", "other"]>>;
        logoStatus: z.ZodDefault<z.ZodEnum<["not_created", "diy", "freelancer", "agency", "finalized"]>>;
        brandColors: z.ZodOptional<z.ZodObject<{
            primary: z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        }, {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        }>>;
        linkedinUrl: z.ZodOptional<z.ZodString>;
        twitterHandle: z.ZodOptional<z.ZodString>;
        instagramHandle: z.ZodOptional<z.ZodString>;
        googleAnalyticsConnected: z.ZodDefault<z.ZodBoolean>;
        googleSearchConsoleConnected: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        websitePlatform: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none";
        useWebBuilder: boolean;
        domainStatus: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active";
        professionalEmailSetup: boolean;
        logoStatus: "not_created" | "diy" | "freelancer" | "agency" | "finalized";
        googleAnalyticsConnected: boolean;
        googleSearchConsoleConnected: boolean;
        websiteUrl?: string | undefined;
        primaryDomain?: string | undefined;
        domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
        emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
        brandColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        linkedinUrl?: string | undefined;
        twitterHandle?: string | undefined;
        instagramHandle?: string | undefined;
    }, {
        websiteUrl?: string | undefined;
        websitePlatform?: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none" | undefined;
        useWebBuilder?: boolean | undefined;
        primaryDomain?: string | undefined;
        domainStatus?: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active" | undefined;
        domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
        professionalEmailSetup?: boolean | undefined;
        emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
        logoStatus?: "not_created" | "diy" | "freelancer" | "agency" | "finalized" | undefined;
        brandColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        linkedinUrl?: string | undefined;
        twitterHandle?: string | undefined;
        instagramHandle?: string | undefined;
        googleAnalyticsConnected?: boolean | undefined;
        googleSearchConsoleConnected?: boolean | undefined;
    }>>;
    phase3Departments: z.ZodDefault<z.ZodObject<{
        sales: z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
            headcount: z.ZodDefault<z.ZodNumber>;
            crmPlatform: z.ZodDefault<z.ZodEnum<["hubspot", "salesforce", "pipedrive", "close", "none"]>>;
        }, "strip", z.ZodTypeAny, {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            crmPlatform: "none" | "hubspot" | "salesforce" | "pipedrive" | "close";
        }, {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            crmPlatform?: "none" | "hubspot" | "salesforce" | "pipedrive" | "close" | undefined;
        }>;
        marketing: z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
            headcount: z.ZodDefault<z.ZodNumber>;
            focus: z.ZodDefault<z.ZodArray<z.ZodEnum<["content", "seo", "paid_ads", "social", "events", "partnerships"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            focus: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[];
        }, {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            focus?: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[] | undefined;
        }>;
        operations: z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
            headcount: z.ZodDefault<z.ZodNumber>;
            tools: z.ZodDefault<z.ZodArray<z.ZodEnum<["notion", "asana", "monday", "clickup", "linear", "custom"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            tools: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[];
        }, {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            tools?: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[] | undefined;
        }>;
        customerSuccess: z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
            headcount: z.ZodDefault<z.ZodNumber>;
            helpdeskPlatform: z.ZodDefault<z.ZodEnum<["zendesk", "intercom", "crisp", "freshdesk", "none"]>>;
        }, "strip", z.ZodTypeAny, {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            helpdeskPlatform: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk";
        }, {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            helpdeskPlatform?: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk" | undefined;
        }>;
        engineering: z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            status: z.ZodDefault<z.ZodEnum<["disabled", "planning", "mvp", "operational", "scaling"]>>;
            headcount: z.ZodDefault<z.ZodNumber>;
            techStack: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            techStack: string[];
        }, {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            techStack?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        sales: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            crmPlatform: "none" | "hubspot" | "salesforce" | "pipedrive" | "close";
        };
        marketing: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            focus: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[];
        };
        operations: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            tools: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[];
        };
        customerSuccess: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            helpdeskPlatform: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk";
        };
        engineering: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            techStack: string[];
        };
    }, {
        sales: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            crmPlatform?: "none" | "hubspot" | "salesforce" | "pipedrive" | "close" | undefined;
        };
        marketing: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            focus?: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[] | undefined;
        };
        operations: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            tools?: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[] | undefined;
        };
        customerSuccess: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            helpdeskPlatform?: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk" | undefined;
        };
        engineering: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            techStack?: string[] | undefined;
        };
    }>>;
    phase4Roadmap: z.ZodDefault<z.ZodObject<{
        daily: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            targetDate: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
            owner: z.ZodOptional<z.ZodString>;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }>, "many">>;
        weekly: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            targetDate: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
            owner: z.ZodOptional<z.ZodString>;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }>, "many">>;
        monthly: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            targetDate: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
            owner: z.ZodOptional<z.ZodString>;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }>, "many">>;
        quarterly: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            targetDate: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
            owner: z.ZodOptional<z.ZodString>;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }>, "many">>;
        yearly: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            targetDate: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "blocked", "completed", "cancelled"]>>;
            owner: z.ZodOptional<z.ZodString>;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            deliverables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }>, "many">>;
        northStarMetric: z.ZodDefault<z.ZodString>;
        currentPhase: z.ZodDefault<z.ZodEnum<["discovery", "validation", "efficiency", "scale"]>>;
    }, "strip", z.ZodTypeAny, {
        daily: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        weekly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        monthly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        quarterly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        yearly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        northStarMetric: string;
        currentPhase: "validation" | "discovery" | "efficiency" | "scale";
    }, {
        daily?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        weekly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        monthly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        quarterly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        yearly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        northStarMetric?: string | undefined;
        currentPhase?: "validation" | "discovery" | "efficiency" | "scale" | undefined;
    }>>;
    currentPhase: z.ZodDefault<z.ZodNumber>;
    completedPhases: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    activeAgents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    completedAgentTasks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    currentPhase: number;
    clientId: string;
    clientName: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    phase1Legal: {
        llcStatus: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active";
        articlesOfOrganizationFiled: boolean;
        registeredAgentService: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other";
        einStatus: "not_applied" | "applied" | "received";
        operatingAgreementStatus: "not_created" | "draft" | "signed" | "notarized";
        operatingAgreementTemplate: "single_member" | "multi_member" | "manager_managed" | "custom";
        caStatementOfInformationFiled: boolean;
        caFranchiseTaxAccountCreated: boolean;
        businessBankAccountOpened: boolean;
        generalLiabilityInsurance: boolean;
        e_oInsurance: boolean;
        _requiredCompleted: boolean;
        llcName?: string | undefined;
        filingNumber?: string | undefined;
        registeredAgentAddress?: string | undefined;
        einNumber?: string | undefined;
        bankName?: string | undefined;
    };
    phase2Digital: {
        websitePlatform: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none";
        useWebBuilder: boolean;
        domainStatus: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active";
        professionalEmailSetup: boolean;
        logoStatus: "not_created" | "diy" | "freelancer" | "agency" | "finalized";
        googleAnalyticsConnected: boolean;
        googleSearchConsoleConnected: boolean;
        websiteUrl?: string | undefined;
        primaryDomain?: string | undefined;
        domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
        emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
        brandColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        linkedinUrl?: string | undefined;
        twitterHandle?: string | undefined;
        instagramHandle?: string | undefined;
    };
    phase3Departments: {
        sales: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            crmPlatform: "none" | "hubspot" | "salesforce" | "pipedrive" | "close";
        };
        marketing: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            focus: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[];
        };
        operations: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            tools: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[];
        };
        customerSuccess: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            helpdeskPlatform: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk";
        };
        engineering: {
            status: "disabled" | "planning" | "mvp" | "operational" | "scaling";
            enabled: boolean;
            headcount: number;
            techStack: string[];
        };
    };
    phase4Roadmap: {
        daily: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        weekly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        monthly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        quarterly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        yearly: {
            status: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled";
            id: string;
            title: string;
            description: string;
            dependencies: string[];
            deliverables: string[];
            targetDate?: string | undefined;
            owner?: string | undefined;
        }[];
        northStarMetric: string;
        currentPhase: "validation" | "discovery" | "efficiency" | "scale";
    };
    completedPhases: number[];
    activeAgents: string[];
    completedAgentTasks: string[];
}, {
    currentPhase?: number | undefined;
    clientId?: string | undefined;
    clientName?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    version?: string | undefined;
    phase1Legal?: {
        llcName?: string | undefined;
        llcStatus?: "not_started" | "name_reserved" | "articles_filed" | "approved" | "active" | undefined;
        articlesOfOrganizationFiled?: boolean | undefined;
        filingNumber?: string | undefined;
        registeredAgentService?: "self" | "northwest" | "legalzoom" | "harbor_compliance" | "other" | undefined;
        registeredAgentAddress?: string | undefined;
        einStatus?: "not_applied" | "applied" | "received" | undefined;
        einNumber?: string | undefined;
        operatingAgreementStatus?: "not_created" | "draft" | "signed" | "notarized" | undefined;
        operatingAgreementTemplate?: "single_member" | "multi_member" | "manager_managed" | "custom" | undefined;
        caStatementOfInformationFiled?: boolean | undefined;
        caFranchiseTaxAccountCreated?: boolean | undefined;
        businessBankAccountOpened?: boolean | undefined;
        bankName?: string | undefined;
        generalLiabilityInsurance?: boolean | undefined;
        e_oInsurance?: boolean | undefined;
        _requiredCompleted?: boolean | undefined;
    } | undefined;
    phase2Digital?: {
        websiteUrl?: string | undefined;
        websitePlatform?: "existing" | "webflow" | "framer" | "wordpress" | "nextjs_custom" | "shopify" | "squarespace" | "wix" | "none" | undefined;
        useWebBuilder?: boolean | undefined;
        primaryDomain?: string | undefined;
        domainStatus?: "not_purchased" | "purchased_unconfigured" | "dns_configured" | "ssl_active" | undefined;
        domainRegistrar?: "other" | "namecheap" | "google_domains" | "cloudflare" | "godaddy" | "porkbun" | undefined;
        professionalEmailSetup?: boolean | undefined;
        emailProvider?: "other" | "google_workspace" | "microsoft_365" | "zoho" | "proton" | undefined;
        logoStatus?: "not_created" | "diy" | "freelancer" | "agency" | "finalized" | undefined;
        brandColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        linkedinUrl?: string | undefined;
        twitterHandle?: string | undefined;
        instagramHandle?: string | undefined;
        googleAnalyticsConnected?: boolean | undefined;
        googleSearchConsoleConnected?: boolean | undefined;
    } | undefined;
    phase3Departments?: {
        sales: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            crmPlatform?: "none" | "hubspot" | "salesforce" | "pipedrive" | "close" | undefined;
        };
        marketing: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            focus?: ("content" | "seo" | "paid_ads" | "social" | "events" | "partnerships")[] | undefined;
        };
        operations: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            tools?: ("custom" | "notion" | "asana" | "monday" | "clickup" | "linear")[] | undefined;
        };
        customerSuccess: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            helpdeskPlatform?: "none" | "zendesk" | "intercom" | "crisp" | "freshdesk" | undefined;
        };
        engineering: {
            status?: "disabled" | "planning" | "mvp" | "operational" | "scaling" | undefined;
            enabled?: boolean | undefined;
            headcount?: number | undefined;
            techStack?: string[] | undefined;
        };
    } | undefined;
    phase4Roadmap?: {
        daily?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        weekly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        monthly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        quarterly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        yearly?: {
            id: string;
            title: string;
            description: string;
            status?: "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | undefined;
            targetDate?: string | undefined;
            owner?: string | undefined;
            dependencies?: string[] | undefined;
            deliverables?: string[] | undefined;
        }[] | undefined;
        northStarMetric?: string | undefined;
        currentPhase?: "validation" | "discovery" | "efficiency" | "scale" | undefined;
    } | undefined;
    completedPhases?: number[] | undefined;
    activeAgents?: string[] | undefined;
    completedAgentTasks?: string[] | undefined;
}>;
export type MasterPlan = z.infer<typeof MasterPlanSchema>;
export type Phase1Legal = z.infer<typeof Phase1LegalSchema>;
export type Phase2Digital = z.infer<typeof Phase2DigitalSchema>;
export type Phase3Departments = z.infer<typeof Phase3DepartmentsSchema>;
export type Phase4Roadmap = z.infer<typeof Phase4RoadmapSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export declare function isPhase1Complete(plan: MasterPlan): boolean;
export declare function getPhase1CompletionSummary(plan: MasterPlan): {
    complete: boolean;
    percentage: number;
    missing: string[];
};
export declare function validateMasterPlan(data: unknown): {
    success: boolean;
    data?: MasterPlan;
    errors?: z.ZodError;
};
//# sourceMappingURL=MasterPlanSchema.d.ts.map