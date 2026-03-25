export declare const CA_LLC_DEFAULTS: {
    formationState: string;
    stateFilingFee: number;
    statementOfInformationFee: number;
    franchiseTaxMin: number;
    operatingAgreementClauses: {
        purpose: string;
        managementStructure: string;
        capitalContributions: string;
        profitDistribution: string;
        decisionMaking: string;
        intellectualProperty: string;
        confidentiality: string;
        disputeResolution: string;
    };
    requiredForms: {
        form: string;
        name: string;
        deadline: string;
    }[];
    recommendedRegisteredAgents: {
        name: string;
        price: number;
        features: string[];
    }[];
};
export declare const REAL_ESTATE_AI_KPIS: {
    leadsPerMonth: {
        target: number;
        benchmark: string;
        description: string;
    };
    costPerLead: {
        target: number;
        benchmark: string;
        description: string;
    };
    leadToMeetingRate: {
        target: number;
        benchmark: string;
        description: string;
    };
    meetingToClientRate: {
        target: number;
        benchmark: string;
        description: string;
    };
    averageResponseTime: {
        targetMinutes: number;
        benchmark: string;
        description: string;
    };
    averageCommissionPerDeal: {
        target: number;
        benchmark: string;
        description: string;
    };
    monthlyRecurringRevenue: {
        target: number;
        milestone_6mo: number;
        milestone_12mo: number;
        milestone_24mo: number;
    };
    aiAccuracyRate: {
        target: number;
        description: string;
    };
    automationSavings: {
        targetHoursPerWeek: number;
        description: string;
    };
};
export declare const SEO_DEFAULTS: {
    siteTitle: string;
    siteDescription: string;
    keywords: string[];
    ogDefaults: {
        type: string;
        locale: string;
        site_name: string;
        image: string;
        imageWidth: number;
        imageHeight: number;
    };
    pageMeta: {
        home: {
            title: string;
            description: string;
        };
        about: {
            title: string;
            description: string;
        };
        services: {
            title: string;
            description: string;
        };
        contact: {
            title: string;
            description: string;
        };
    };
    robots: string;
    viewport: string;
    themeColor: string;
    organizationSchema: {
        "@context": string;
        "@type": string;
        name: string;
        description: string;
        url: string;
        logo: string;
        sameAs: string[];
        address: {
            "@type": string;
            addressLocality: string;
            addressRegion: string;
            addressCountry: string;
        };
    };
};
export declare const AGENT_PROMPTS: {
    websiteReviewer: string;
    webBuilder: string;
    legalCompliance: string;
    marketIntelligence: string;
    onboardingGuide: string;
};
export declare const TECH_STACK_DEFAULTS: {
    frontend: {
        framework: string;
        language: string;
        styling: string;
        state: string;
        forms: string;
    };
    backend: {
        api: string;
        database: string;
        auth: string;
        storage: string;
        realtime: string;
    };
    ai: {
        llm: string;
        embeddings: string;
        vectorStore: string;
        orchestration: string;
        monitoring: string;
    };
    devops: {
        hosting: string;
        ci_cd: string;
        monitoring: string;
        email: string;
        sms: string;
    };
};
export declare const MILESTONE_TEMPLATES: {
    week1: {
        id: string;
        title: string;
        description: string;
        owner: string;
        deliverables: string[];
    }[];
    month1: {
        id: string;
        title: string;
        description: string;
        owner: string;
        deliverables: string[];
    }[];
    quarter1: {
        id: string;
        title: string;
        description: string;
        owner: string;
        deliverables: string[];
    }[];
};
export declare const DEFAULT_MASTER_PLAN: {
    clientId: string;
    clientName: string;
    version: string;
    phase1Legal: {
        llcStatus: string;
        articlesOfOrganizationFiled: boolean;
        registeredAgentService: string;
        einStatus: string;
        operatingAgreementStatus: string;
        operatingAgreementTemplate: string;
        caStatementOfInformationFiled: boolean;
        caFranchiseTaxAccountCreated: boolean;
        businessBankAccountOpened: boolean;
        generalLiabilityInsurance: boolean;
        e_oInsurance: boolean;
        _requiredCompleted: boolean;
    };
    phase2Digital: {
        websitePlatform: string;
        useWebBuilder: boolean;
        domainStatus: string;
        professionalEmailSetup: boolean;
        logoStatus: string;
        googleAnalyticsConnected: boolean;
        googleSearchConsoleConnected: boolean;
    };
    phase3Departments: {
        sales: {
            enabled: boolean;
            status: string;
            headcount: number;
            crmPlatform: string;
        };
        marketing: {
            enabled: boolean;
            status: string;
            headcount: number;
            focus: string[];
        };
        operations: {
            enabled: boolean;
            status: string;
            headcount: number;
            tools: string[];
        };
        customerSuccess: {
            enabled: boolean;
            status: string;
            headcount: number;
            helpdeskPlatform: string;
        };
        engineering: {
            enabled: boolean;
            status: string;
            headcount: number;
            techStack: {
                frontend: {
                    framework: string;
                    language: string;
                    styling: string;
                    state: string;
                    forms: string;
                };
                backend: {
                    api: string;
                    database: string;
                    auth: string;
                    storage: string;
                    realtime: string;
                };
                ai: {
                    llm: string;
                    embeddings: string;
                    vectorStore: string;
                    orchestration: string;
                    monitoring: string;
                };
                devops: {
                    hosting: string;
                    ci_cd: string;
                    monitoring: string;
                    email: string;
                    sms: string;
                };
            };
        };
    };
    phase4Roadmap: {
        daily: never[];
        weekly: never[];
        monthly: {
            id: string;
            title: string;
            description: string;
            owner: string;
            deliverables: string[];
        }[];
        quarterly: {
            id: string;
            title: string;
            description: string;
            owner: string;
            deliverables: string[];
        }[];
        yearly: never[];
        northStarMetric: string;
        currentPhase: string;
    };
    currentPhase: number;
    completedPhases: never[];
    activeAgents: string[];
    completedAgentTasks: never[];
};
export declare function getShadowValue<T>(userValue: T | undefined | null, defaultValue: T): T;
export declare function mergeWithDefaults<T extends Record<string, unknown>>(userConfig: Partial<T>, defaults: T): T;
//# sourceMappingURL=business-defaults.d.ts.map