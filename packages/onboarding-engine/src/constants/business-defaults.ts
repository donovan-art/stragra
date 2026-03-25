/**
 * Business Defaults - California AI Agency
 * 
 * Pre-loaded "shadow fields" for Client #001 (Stragra)
 * These values are used unless explicitly overridden by the user.
 * 
 * Theme: "The overwhelming work is already done"
 */

// ============================================================================
// California LLC Defaults
// ============================================================================

export const CA_LLC_DEFAULTS = {
  // Formation
  formationState: "California",
  stateFilingFee: 70,
  statementOfInformationFee: 20,
  franchiseTaxMin: 800, // Annual minimum
  
  // Standard Clauses for AI Agency
  operatingAgreementClauses: {
    purpose: `The purpose of this LLC is to engage in any lawful act or activity 
      for which a limited liability company may be organized under California law, 
      including but not limited to: developing and deploying artificial intelligence 
      solutions, software development, data analytics, technology consulting, and 
      related services.`,
    
    managementStructure: "Manager-Managed",
    
    capitalContributions: `Initial capital contribution shall be in the form of 
      cash, equipment, intellectual property, or services as agreed upon by the 
      Members and documented in Schedule A.`,
    
    profitDistribution: `Profits and losses shall be allocated in proportion to 
      each Member's capital contribution percentage unless otherwise agreed in writing.`,
    
    decisionMaking: `Major decisions require approval by Members holding at least 
      67% of the capital interests. Day-to-day operations are managed by the 
      appointed Manager(s).`,
    
    intellectualProperty: `All intellectual property developed by Members in the 
      course of LLC business shall be owned by the LLC. This includes software, 
      AI models, data sets, and proprietary methodologies.`,
    
    confidentiality: `Members agree to maintain strict confidentiality regarding 
      all proprietary information, client data, and trade secrets of the LLC. 
      This obligation survives termination of membership.`,
    
    disputeResolution: `Any disputes arising under this Agreement shall first be 
      subject to non-binding mediation in San Francisco County, California. If 
      unresolved, disputes shall be settled by binding arbitration under JAMS rules.`,
  },
  
  // Required CA Forms
  requiredForms: [
    { form: "Form LLC-1", name: "Articles of Organization", deadline: "Before operating" },
    { form: "Form LLC-12", name: "Statement of Information", deadline: "Within 90 days of formation, then biennially" },
    { form: "FTB 3522", name: "LLC Tax Voucher", deadline: "Annually by 4/15" },
    { form: "FTB 568", name: "LLC Return of Income", deadline: "Annually by 4/15" },
  ],
  
  // Registered Agent Services
  recommendedRegisteredAgents: [
    { name: "Northwest Registered Agent", price: 125, features: ["Privacy protection", "Same-day scans", "Compliance alerts"] },
    { name: "Harbor Compliance", price: 99, features: ["Entity management software", "Annual report service"] },
  ],
};

// ============================================================================
// Real Estate AI Agency KPIs
// ============================================================================

export const REAL_ESTATE_AI_KPIS = {
  // Lead Generation
  leadsPerMonth: {
    target: 500,
    benchmark: "Industry average: 200-400",
    description: "Total qualified leads generated through AI-driven campaigns",
  },
  
  costPerLead: {
    target: 15,
    benchmark: "Industry average: $25-50",
    description: "Total marketing spend divided by number of leads",
  },
  
  // Conversion
  leadToMeetingRate: {
    target: 0.15, // 15%
    benchmark: "Industry average: 8-12%",
    description: "Percentage of leads that schedule a consultation",
  },
  
  meetingToClientRate: {
    target: 0.30, // 30%
    benchmark: "Industry average: 20-25%",
    description: "Percentage of meetings that convert to signed clients",
  },
  
  // Operational
  averageResponseTime: {
    targetMinutes: 5,
    benchmark: "Industry average: 2-4 hours",
    description: "AI chatbot response time to initial inquiry",
  },
  
  // Revenue
  averageCommissionPerDeal: {
    target: 15000,
    benchmark: "Varies by market",
    description: "Average commission earned per closed transaction",
  },
  
  monthlyRecurringRevenue: {
    target: 50000,
    milestone_6mo: 25000,
    milestone_12mo: 50000,
    milestone_24mo: 150000,
  },
  
  // AI-Specific Metrics
  aiAccuracyRate: {
    target: 0.95, // 95%
    description: "Percentage of AI-generated property matches that result in positive client feedback",
  },
  
  automationSavings: {
    targetHoursPerWeek: 40,
    description: "Hours saved per week through AI automation vs manual processes",
  },
};

// ============================================================================
// SEO & Meta Tags
// ============================================================================

export const SEO_DEFAULTS = {
  // Site-wide
  siteTitle: "Stragra | AI-Powered Real Estate Intelligence",
  siteDescription: `Transform your real estate business with Stragra's AI-driven 
    market analysis, lead generation, and client matching. California's premier 
    real estate technology partner.`,
  
  keywords: [
    "real estate AI",
    "property technology",
    "real estate automation",
    "AI property matching",
    "California real estate",
    "real estate lead generation",
    "predictive analytics real estate",
    "smart property search",
  ],
  
  // Open Graph
  ogDefaults: {
    type: "website",
    locale: "en_US",
    site_name: "Stragra",
    image: "/og-image.jpg",
    imageWidth: 1200,
    imageHeight: 630,
  },
  
  // Page-specific
  pageMeta: {
    home: {
      title: "Stragra | AI-Powered Real Estate Intelligence Platform",
      description: "Unlock the future of real estate with AI-driven market insights, automated lead generation, and intelligent client matching.",
    },
    about: {
      title: "About Stragra | Pioneering Real Estate AI",
      description: "Learn how Stragra combines cutting-edge AI with deep real estate expertise to transform property transactions.",
    },
    services: {
      title: "Real Estate AI Services | Stragra",
      description: "Explore our suite of AI-powered services: market analysis, lead scoring, property matching, and automation solutions.",
    },
    contact: {
      title: "Contact Stragra | Start Your AI Journey",
      description: "Ready to transform your real estate business? Get in touch with our AI specialists today.",
    },
  },
  
  // Technical SEO
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0F172A", // Dark slate
  
  // Structured Data (JSON-LD)
  organizationSchema: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stragra",
    description: "AI-Powered Real Estate Intelligence Platform",
    url: "https://stragra.ai",
    logo: "https://stragra.ai/logo.png",
    sameAs: [
      "https://linkedin.com/company/stragra",
      "https://twitter.com/stragraai",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
};

// ============================================================================
// Agent System Prompts
// ============================================================================

export const AGENT_PROMPTS = {
  // Website Reviewer Agent
  websiteReviewer: `You are Stragra's Website Intelligence Agent. Your role is to 
    analyze real estate websites and provide actionable improvement recommendations.
    
    ANALYSIS FRAMEWORK:
    1. Technical Performance (speed, mobile responsiveness, SEO)
    2. User Experience (navigation, CTAs, forms)
    3. Content Quality (uniqueness, keyword optimization, local relevance)
    4. Conversion Optimization (trust signals, social proof, lead capture)
    5. AI Integration Opportunities (chatbots, personalization, automation)
    
    OUTPUT FORMAT:
    - Overall Score (0-100)
    - Critical Issues (must fix)
    - Quick Wins (easy improvements)
    - Strategic Recommendations (long-term)
    - AI Enhancement Roadmap
    
    Be specific, cite examples, and prioritize by impact vs effort.`,
  
  // Web Builder Agent
  webBuilder: `You are Stragra's Web Builder Architect. You design high-converting 
    real estate websites optimized for AI integration.
    
    DESIGN PRINCIPLES:
    1. Mobile-first responsive design
    2. Sub-3-second load times
    3. Clear value proposition above the fold
    4. Trust signals (testimonials, certifications, stats)
    5. Multi-step lead capture forms
    6. Integrated AI chatbot placement
    7. Neighborhood-specific landing pages
    
    COMPONENT LIBRARY:
    - Hero with dynamic property showcase
    - AI Value Calculator
    - Interactive Map Integration
    - Testimonial Carousel
    - FAQ Accordion
    - Blog/Content Hub
    - Lead Magnet Download
    
    Always recommend best-in-class tools and justify technology choices.`,
  
  // Legal Compliance Agent
  legalCompliance: `You are Stragra's Legal Compliance Agent specializing in 
    California real estate and AI regulations.
    
    COMPLIANCE CHECKLIST:
    1. DRE (Department of Real Estate) requirements
    2. California Consumer Privacy Act (CCPA) compliance
    3. AI disclosure requirements
    4. Fair Housing Act adherence in AI training data
    5. Terms of Service and Privacy Policy requirements
    6. Data retention and deletion policies
    7. Brokerage affiliation documentation
    
    Provide specific California statute citations and recommend compliance tools.`,
  
  // Market Intelligence Agent
  marketIntelligence: `You are Stragra's Market Intelligence Agent. You analyze 
    real estate markets and generate AI-ready data insights.
    
    DATA SOURCES:
    - MLS feeds (CRMLS, SFARMLS)
    - Public records (tax, permits, zoning)
    - Economic indicators (employment, rates, inventory)
    - Social sentiment (reviews, complaints, trends)
    
    ANALYSIS OUTPUTS:
    1. Neighborhood price velocity
    2. Days-on-market trends
    3. Buyer vs seller market indicators
    4. Investment opportunity scores
    5. Seasonal pattern predictions
    
    Format all outputs for API consumption and visualization.`,
  
  // Onboarding Guide Agent
  onboardingGuide: `You are Stragra's Onboarding Concierge. You guide new clients 
    through the Master Plan setup with a friendly, professional tone.
    
    PERSONALITY:
    - Encouraging but not overly casual
    - Knowledgeable about California real estate specifics
    - Proactive in suggesting next steps
    - Celebrates milestones
    
    CAPABILITIES:
    - Explain complex legal concepts simply
    - Recommend trusted service providers
    - Generate templates and drafts
    - Answer FAQ about the process
    - Flag potential issues before they become problems
    
    Always maintain context of where the user is in their Master Plan journey.`,
};

// ============================================================================
// Recommended Tech Stack
// ============================================================================

export const TECH_STACK_DEFAULTS = {
  frontend: {
    framework: "Next.js 14 (App Router)",
    language: "TypeScript",
    styling: "Tailwind CSS + shadcn/ui",
    state: "Zustand + React Query",
    forms: "React Hook Form + Zod",
  },
  
  backend: {
    api: "Next.js API Routes + tRPC",
    database: "Supabase (PostgreSQL)",
    auth: "Supabase Auth",
    storage: "Supabase Storage",
    realtime: "Supabase Realtime",
  },
  
  ai: {
    llm: "OpenAI GPT-4 Turbo",
    embeddings: "OpenAI text-embedding-3-large",
    vectorStore: "Pinecone",
    orchestration: "LangChain / LlamaIndex",
    monitoring: "LangSmith",
  },
  
  devops: {
    hosting: "Vercel",
    ci_cd: "GitHub Actions",
    monitoring: "Vercel Analytics + Sentry",
    email: "Resend",
    sms: "Twilio",
  },
};

// ============================================================================
// Pre-Built Milestone Templates
// ============================================================================

export const MILESTONE_TEMPLATES = {
  // Week 1 Milestones
  week1: [
    {
      id: "w1-1",
      title: "Reserve LLC Name",
      description: "Check availability and reserve LLC name with CA Secretary of State",
      owner: "Legal",
      deliverables: ["Name availability confirmation", "Reservation receipt"],
    },
    {
      id: "w1-2",
      title: "File Articles of Organization",
      description: "Submit Form LLC-1 and pay $70 filing fee",
      owner: "Legal",
      deliverables: ["Filed Articles", "Filing receipt"],
    },
    {
      id: "w1-3",
      title: "Apply for EIN",
      description: "Submit IRS Form SS-4 online",
      owner: "Legal",
      deliverables: ["EIN confirmation letter"],
    },
  ],
  
  // Month 1 Milestones
  month1: [
    {
      id: "m1-1",
      title: "Launch MVP Website",
      description: "Deploy landing page with lead capture and basic company info",
      owner: "Engineering",
      deliverables: ["Live website", "Analytics connected", "Lead capture tested"],
    },
    {
      id: "m1-2",
      title: "First AI Model Trained",
      description: "Initial property matching algorithm trained on sample data",
      owner: "Engineering",
      deliverables: ["Model checkpoint", "Evaluation metrics", "API endpoint"],
    },
    {
      id: "m1-3",
      title: "Close First Client",
      description: "Sign first real estate agent or brokerage to platform",
      owner: "Sales",
      deliverables: ["Signed contract", "Onboarding completed"],
    },
  ],
  
  // Quarter 1 Milestones
  quarter1: [
    {
      id: "q1-1",
      title: "Achieve Product-Market Fit",
      description: "10+ paying clients with >80% retention rate",
      owner: "Leadership",
      deliverables: ["Client testimonials", "Case studies", "NPS score >50"],
    },
    {
      id: "q1-2",
      title: "Series Seed Preparation",
      description: "Pitch deck, financial model, and data room ready",
      owner: "Leadership",
      deliverables: ["Pitch deck", "Financial model", "Data room"],
    },
  ],
};

// ============================================================================
// Default Master Plan (Complete Pre-Loaded Config)
// ============================================================================

export const DEFAULT_MASTER_PLAN = {
  clientId: "001-stragra",
  clientName: "Stragra",
  version: "1.0.0",
  
  phase1Legal: {
    llcStatus: "not_started",
    articlesOfOrganizationFiled: false,
    registeredAgentService: "northwest",
    einStatus: "not_applied",
    operatingAgreementStatus: "not_created",
    operatingAgreementTemplate: "manager_managed",
    caStatementOfInformationFiled: false,
    caFranchiseTaxAccountCreated: false,
    businessBankAccountOpened: false,
    generalLiabilityInsurance: false,
    e_oInsurance: false,
    _requiredCompleted: false,
  },
  
  phase2Digital: {
    websitePlatform: "nextjs_custom",
    useWebBuilder: true,
    domainStatus: "not_purchased",
    professionalEmailSetup: false,
    logoStatus: "not_created",
    googleAnalyticsConnected: false,
    googleSearchConsoleConnected: false,
  },
  
  phase3Departments: {
    sales: { enabled: true, status: "planning", headcount: 0, crmPlatform: "hubspot" },
    marketing: { enabled: true, status: "planning", headcount: 0, focus: ["content", "seo", "paid_ads"] },
    operations: { enabled: true, status: "planning", headcount: 0, tools: ["notion", "linear"] },
    customerSuccess: { enabled: true, status: "planning", headcount: 0, helpdeskPlatform: "intercom" },
    engineering: { enabled: true, status: "planning", headcount: 1, techStack: TECH_STACK_DEFAULTS },
  },
  
  phase4Roadmap: {
    daily: [],
    weekly: [],
    monthly: MILESTONE_TEMPLATES.month1,
    quarterly: MILESTONE_TEMPLATES.quarter1,
    yearly: [],
    northStarMetric: "Monthly Recurring Revenue (MRR)",
    currentPhase: "discovery",
  },
  
  currentPhase: 1,
  completedPhases: [],
  activeAgents: ["onboardingGuide"],
  completedAgentTasks: [],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets a shadow value - returns default if user value is undefined/null
 */
export function getShadowValue<T>(
  userValue: T | undefined | null,
  defaultValue: T
): T {
  return userValue ?? defaultValue;
}

/**
 * Merges user config with defaults (shadow fields pattern)
 */
export function mergeWithDefaults<T extends Record<string, unknown>>(
  userConfig: Partial<T>,
  defaults: T
): T {
  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(userConfig).filter(([, v]) => v !== undefined && v !== null)
    ),
  } as T;
}
