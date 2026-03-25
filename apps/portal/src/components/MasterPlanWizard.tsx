/"**
 * MasterPlanWizard.tsx
 * 
 * The main onboarding wizard component for Client #001 (Stragra).
 * Implements sequential gating: user cannot proceed to Phase 2 until
 * all required Phase 1 fields are validated.
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  Globe,
  Users,
  Map,
  AlertCircle,
  Save,
  Sparkles,
  Loader2,
  Shield,
  Rocket,
} from "lucide-react";
import {
  MasterPlan,
  Phase1Legal,
  Phase2Digital,
  Phase3Departments,
  Phase4Roadmap,
  isPhase1Complete,
  getPhase1CompletionSummary,
  validateMasterPlan,
} from "@stragra/onboarding-engine/schemas/MasterPlanSchema";
import {
  DEFAULT_MASTER_PLAN,
  getShadowValue,
  CA_LLC_DEFAULTS,
  REAL_ESTATE_AI_KPIS,
} from "@stragra/onboarding-engine/constants/business-defaults";
import {
  evaluateRoutingRules,
  simulateAgentTask,
  canProceedToPhase,
  getPendingAgentTasks,
  AgentTask,
} from "@stragra/onboarding-engine/utils/AgentRouter";

// ============================================================================
// Types
// ============================================================================

interface MasterPlanWizardProps {
  clientId?: string;
  initialData?: Partial<MasterPlan>;
  onSave?: (plan: MasterPlan) => void;
  storageKey?: string;
}

interface PhaseConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
}

// ============================================================================
// Phase Configuration
// ============================================================================

const PHASES: PhaseConfig[] = [
  {
    id: 1,
    title: "Legal & Entity",
    subtitle: "Foundation",
    icon: <Shield className="w-5 h-5" />,
    description: "Set up your California LLC, EIN, and legal foundation",
  },
  {
    id: 2,
    title: "Digital Presence",
    subtitle: "Brand",
    icon: <Globe className="w-5 h-5" />,
    description: "Build your website and establish online presence",
  },
  {
    id: 3,
    title: "Departments",
    subtitle: "Team",
    icon: <Users className="w-5 h-5" />,
    description: "Configure your sales, marketing, and ops teams",
  },
  {
    id: 4,
    title: "Roadmap",
    subtitle: "Growth",
    icon: <Map className="w-5 h-5" />,
    description: "Set milestones and track your progress",
  },
];

// ============================================================================
// Storage Utilities
// ============================================================================

const STORAGE_DIR = "clients/001-stragra";
const STORAGE_FILE = "master-plan.json";

async function saveToFile(plan: MasterPlan): Promise<void> {
  try {
    // In a real app, this would call an API endpoint
    // For now, we'll use localStorage as a fallback
    const key = `${STORAGE_DIR}/${STORAGE_FILE}`;
    localStorage.setItem(key, JSON.stringify(plan, null, 2));
    
    // Also save a backup with timestamp
    const backupKey = `${STORAGE_DIR}/backups/master-plan-${Date.now()}.json`;
    localStorage.setItem(backupKey, JSON.stringify(plan, null, 2));
    
    console.log("[MasterPlanWizard] Saved to", key);
  } catch (error) {
    console.error("[MasterPlanWizard] Save failed:", error);
    throw error;
  }
}

async function loadFromFile(): Promise<MasterPlan | null> {
  try {
    const key = `${STORAGE_DIR}/${STORAGE_FILE}`;
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      const validation = validateMasterPlan(parsed);
      if (validation.success && validation.data) {
        return validation.data;
      }
    }
    return null;
  } catch (error) {
    console.error("[MasterPlanWizard] Load failed:", error);
    return null;
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function MasterPlanWizard({
  clientId = "001-stragra",
  initialData,
  onSave,
  storageKey = "master-plan",
}: MasterPlanWizardProps): JSX.Element {
  // Initialize state with defaults merged with any saved data
  const [plan, setPlan] = useState<MasterPlan>(() => {
    const base = { ...DEFAULT_MASTER_PLAN, clientId };
    return initialData ? { ...base, ...initialData } : base;
  });
  
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | null>(null);
  const [pendingAgents, setPendingAgents] = useState<AgentTask[]>([]);
  const [isRunningAgents, setIsRunningAgents] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved data on mount
  useEffect(() => {
    loadFromFile().then((saved) => {
      if (saved) {
        setPlan(saved);
        setCurrentPhase(saved.currentPhase);
        setLastSaved(new Date(saved.updatedAt));
      }
    });
  }, []);

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [plan]);

  // Update pending agents when plan changes
  useEffect(() => {
    const agents = evaluateRoutingRules(plan);
    setPendingAgents(agents);
  }, [plan]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    
    try {
      const updatedPlan = {
        ...plan,
        updatedAt: new Date().toISOString(),
        currentPhase,
      };
      
      await saveToFile(updatedPlan);
      setPlan(updatedPlan);
      setSaveStatus("saved");
      setLastSaved(new Date());
      onSave?.(updatedPlan);
      
      // Clear saved status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [plan, currentPhase, onSave]);

  const handleNext = useCallback(async () => {
    if (currentPhase < 4) {
      // Check if we can proceed
      const check = canProceedToPhase(currentPhase, currentPhase + 1, plan);
      
      if (!check.allowed) {
        alert(`Cannot proceed: ${check.reason}`);
        return;
      }
      
      // Save before transitioning
      await handleSave();
      
      // Mark current phase as complete
      if (!plan.completedPhases.includes(currentPhase)) {
        setPlan((p) => ({
          ...p,
          completedPhases: [...p.completedPhases, currentPhase],
        }));
      }
      
      setCurrentPhase((p) => p + 1);
    }
  }, [currentPhase, plan, handleSave]);

  const handlePrevious = useCallback(() => {
    if (currentPhase > 1) {
      setCurrentPhase((p) => p - 1);
    }
  }, [currentPhase]);

  const handleRunAgents = useCallback(async () => {
    setIsRunningAgents(true);
    
    for (const task of pendingAgents) {
      console.log(`Running agent: ${task.agentId}`);
      const result = await simulateAgentTask(task);
      console.log(`Agent result:`, result);
      
      // Mark as completed
      setPlan((p) => ({
        ...p,
        completedAgentTasks: [...p.completedAgentTasks, task.id],
      }));
    }
    
    setIsRunningAgents(false);
  }, [pendingAgents]);

  const updatePlan = useCallback((updater: (p: MasterPlan) => MasterPlan) => {
    setPlan((prev) => updater(prev));
  }, []);

  // Get phase 1 completion for progress bar
  const phase1Summary = getPhase1CompletionSummary(plan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Master Plan</h1>
                <p className="text-sm text-gray-500">{plan.clientName} • Client #{plan.clientId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Save Status */}
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-gray-500">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Save failed</span>
                  </>
                )}
                {lastSaved && !saveStatus && (
                  <span className="text-gray-400 text-xs">
                    Last saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - Phase Navigation */}
          <div className="col-span-3">
            <nav className="space-y-2">
              {PHASES.map((phase) => {
                const isActive = currentPhase === phase.id;
                const isCompleted = plan.completedPhases.includes(phase.id);
                const isLocked = phase.id > currentPhase + 1;
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => {
                      if (!isLocked) setCurrentPhase(phase.id);
                    }}
                    disabled={isLocked}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all ${
                      isActive
                        ? "bg-blue-50 border-2 border-blue-200"
                        : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : isLocked
                        ? "bg-gray-100 opacity-50 cursor-not-allowed"
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{phase.id}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          isActive ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {phase.title}
                      </p>
                      <p className="text-xs text-gray-500">{phase.subtitle}</p>
                      
                      {/* Phase 1 Progress */}
                      {phase.id === 1 && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all"
                              style={{ width: `${phase1Summary.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {phase1Summary.percentage}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
            
            {/* Agent Status */}
            {pendingAgents.length > 0 && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">AI Agents Ready</span>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  {pendingAgents.length} task{pendingAgents.length > 1 ? "s" : ""} queued
                </p>
                <button
                  onClick={handleRunAgents}
                  disabled={isRunningAgents}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isRunningAgents ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Run Agents
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              {/* Phase Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {PHASES[currentPhase - 1].icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {PHASES[currentPhase - 1].title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {PHASES[currentPhase - 1].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              <div className="p-6">
                {currentPhase === 1 && (
                  <Phase1Form plan={plan} onChange={updatePlan} />
                )}
                {currentPhase === 2 && (
                  <Phase2Form plan={plan} onChange={updatePlan} />
                )}
                {currentPhase === 3 && (
                  <Phase3Form plan={plan} onChange={updatePlan} />
                )}
                {currentPhase === 4 && (
                  <Phase4Form plan={plan} onChange={updatePlan} />
                )}
              </div>

              {/* Navigation Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentPhase === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  {currentPhase < 4 && !canProceedToPhase(currentPhase, currentPhase + 1, plan).allowed && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Complete required fields to continue</span>
                    </div>
                  )}
                  
                  <button
                    onClick={handleNext}
                    disabled={currentPhase === 4 || !canProceedToPhase(currentPhase, currentPhase + 1, plan).allowed}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentPhase === 4 ? "Complete" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Phase 1 Form: Legal & Entity
// ============================================================================

function Phase1Form({
  plan,
  onChange,
}: {
  plan: MasterPlan;
  onChange: (updater: (p: MasterPlan) => MasterPlan) => void;
}): JSX.Element {
  const p1 = plan.phase1Legal;
  const summary = getPhase1CompletionSummary(plan);

  return (
    <div className="space-y-6">
      {/* Completion Banner */}
      {summary.complete && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Phase 1 Complete!</p>
            <p className="text-sm text-green-700">All required fields are filled. You can proceed to Phase 2.</p>
          </div>
        </div>
      )}

      {/* LLC Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          LLC Formation (California)
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LLC Name *
              <span className="text-gray-400 font-normal ml-1">(Default: Stragra AI LLC)</span>
            </label>
            <input
              type="text"
              value={p1.llcName || ""}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase1Legal: { ...p.phase1Legal, llcName: e.target.value },
                }))
              }
              placeholder="Stragra AI LLC"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">{CA_LLC_DEFAULTS.formationState} filing fee: ${CA_LLC_DEFAULTS.stateFilingFee}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LLC Status *</label>
            <select
              value={p1.llcStatus}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase1Legal: {
                    ...p.phase1Legal,
                    llcStatus: e.target.value as Phase1Legal["llcStatus"],
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="not_started">Not Started</option>
              <option value="name_reserved">Name Reserved</option>
              <option value="articles_filed">Articles Filed</option>
              <option value="approved">Approved</option>
              <option value="active">Active ✓</option>
            </select>
          </div>
        </div>
      </section>

      {/* EIN Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">EIN (Tax ID)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EIN Status *</label>
            <select
              value={p1.einStatus}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase1Legal: {
                    ...p.phase1Legal,
                    einStatus: e.target.value as Phase1Legal["einStatus"],
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="not_applied">Not Applied</option>
              <option value="applied">Applied</option>
              <option value="received">Received ✓</option>
            </select>
          </div>

          {p1.einStatus === "received" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EIN Number</label>
              <input
                type="text"
                value={p1.einNumber || ""}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    phase1Legal: { ...p.phase1Legal, einNumber: e.target.value },
                  }))
                }
                placeholder="XX-XXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Operating Agreement */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Operating Agreement</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Pre-loaded template: <strong>{CA_LLC_DEFAULTS.operatingAgreementClauses.managementStructure}</strong>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Status *</label>
              <select
                value={p1.operatingAgreementStatus}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    phase1Legal: {
                      ...p.phase1Legal,
                      operatingAgreementStatus: e.target.value as Phase1Legal["operatingAgreementStatus"],
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="not_created">Not Created</option>
                <option value="draft">Draft</option>
                <option value="signed">Signed ✓</option>
                <option value="notarized">Notarized</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* California Compliance */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">California Compliance *</h3>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={p1.caStatementOfInformationFiled}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase1Legal: {
                    ...p.phase1Legal,
                    caStatementOfInformationFiled: e.target.checked,
                  },
                }))
              }
              className="mt-0.5 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Statement of Information (Form LLC-12)</p>
              <p className="text-sm text-gray-500">Filed within 90 days, then every 2 years</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={p1.caFranchiseTaxAccountCreated}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase1Legal: {
                    ...p.phase1Legal,
                    caFranchiseTaxAccountCreated: e.target.checked,
                  },
                }))
              }
              className="mt-0.5 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900">CA Franchise Tax Account</p>
              <p className="text-sm text-gray-500">Minimum $800/year tax (due by 4/15)</p>
            </div>
          </label>
        </div>
      </section>

      {/* Missing Fields Alert */}
      {summary.missing.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="font-medium text-amber-900 mb-2">Required to proceed:</p>
          <ul className="list-disc list-inside text-sm text-amber-800">
            {summary.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Phase 2 Form: Digital Presence
// ============================================================================

function Phase2Form({
  plan,
  onChange,
}: {
  plan: MasterPlan;
  onChange: (updater: (p: MasterPlan) => MasterPlan) => void;
}): JSX.Element {
  const p2 = plan.phase2Digital;
  const hasWebsite = !!p2.websiteUrl;

  return (
    <div className="space-y-6">
      {/* Website Strategy Toggle */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Website Strategy</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              onChange((p) => ({
                ...p,
                phase2Digital: {
                  ...p.phase2Digital,
                  useWebBuilder: false,
                  websiteUrl: p.phase2Digital.websiteUrl || "",
                },
              }))
            }
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              !p2.useWebBuilder
                ? "border-blue-500 bg-white"
                : "border-transparent bg-white/50"
            }`}
          >
            <p className="font-medium text-gray-900">I have a website</p>
            <p className="text-sm text-gray-500 mt-1">Enter your URL for AI review</p>
          </button>

          <button
            onClick={() =>
              onChange((p) => ({
                ...p,
                phase2Digital: {
                  ...p.phase2Digital,
                  useWebBuilder: true,
                  websiteUrl: undefined,
                },
              }))
            }
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              p2.useWebBuilder
                ? "border-blue-500 bg-white"
                : "border-transparent bg-white/50"
            }`}
          >
            <p className="font-medium text-gray-900">Build new website</p>
            <p className="text-sm text-gray-500 mt-1">AI will architect a new site</p>
          </button>
        </div>
      </section>

      {/* Website URL Input */}
      {!p2.useWebBuilder && (
        <section className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Website URL</label>
          <input
            type="url"
            value={p2.websiteUrl || ""}
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                phase2Digital: { ...p.phase2Digital, websiteUrl: e.target.value },
              }))
            }
            placeholder="https://yourcompany.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {hasWebsite && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              WebsiteReviewer agent will analyze this
            </p>
          )}
        </section>
      )}

      {/* Web Builder Options */}
      {p2.useWebBuilder && (
        <section className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-medium text-purple-900">WebBuilderAgent Activated</p>
            <p className="text-sm text-purple-700 mt-1">
              The AI will create a complete website architecture for your real estate agency.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={p2.websitePlatform}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    phase2Digital: {
                      ...p.phase2Digital,
                      websitePlatform: e.target.value as Phase2Digital["websitePlatform"],
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="nextjs_custom">Next.js (Custom) - Recommended</option>
                <option value="webflow">Webflow</option>
                <option value="framer">Framer</option>
                <option value="wordpress">WordPress</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Domain</label>
              <input
                type="text"
                value={p2.primaryDomain || ""}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    phase2Digital: {
                      ...p.phase2Digital,
                      primaryDomain: e.target.value,
                    },
                  }))
                }
                placeholder="stragra.ai"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Branding */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Branding</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Status</label>
            <select
              value={p2.logoStatus}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  phase2Digital: {
                    ...p.phase2Digital,
                    logoStatus: e.target.value as Phase2Digital["logoStatus"],
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="not_created">Not Created</option>
              <option value="diy">DIY</option>
              <option value="freelancer">Hired Freelancer</option>
              <option value="agency">Design Agency</option>
              <option value="finalized">Finalized ✓</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Phase 3 Form: Departments
// ============================================================================

function Phase3Form({
  plan,
  onChange,
}: {
  plan: MasterPlan;
  onChange: (updater: (p: MasterPlan) => MasterPlan) => void;
}): JSX.Element {
  const p3 = plan.phase3Departments;

  const departments = [
    { key: "sales", label: "Sales", icon: "💰" },
    { key: "marketing", label: "Marketing", icon: "📢" },
    { key: "operations", label: "Operations", icon: "⚙️" },
    { key: "customerSuccess", label: "Customer Success", icon: "🤝" },
    { key: "engineering", label: "Engineering", icon: "💻" },
  ] as const;

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Enable and configure the departments you need. All settings use smart defaults
        that you can customize.
      </p>

      <div className="grid gap-4">
        {departments.map((dept) => {
          const config = p3[dept.key as keyof Phase3Departments];
          if (typeof config !== "object" || config === null) return null;
          
          const isEnabled = "enabled" in config ? config.enabled : false;
          const headcount = "headcount" in config ? config.headcount : 0;
          
          return (
            <div
              key={dept.key}
              className={`p-4 border-2 rounded-lg transition-all ${
                isEnabled ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dept.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{dept.label}</p>
                    <p className="text-sm text-gray-500">
                      {isEnabled ? "Enabled" : "Disabled"} • {headcount} people
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) =>
                      onChange((p) => ({
                        ...p,
                        phase3Departments: {
                          ...p.phase3Departments,
                          [dept.key]: { ...config, enabled: e.target.checked },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {isEnabled && dept.key === "sales" && "crmPlatform" in config && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CRM Platform</label>
                  <select
                    value={config.crmPlatform as string}
                    onChange={(e) =>
                      onChange((p) => ({
                        ...p,
                        phase3Departments: {
                          ...p.phase3Departments,
                          sales: { ...config, crmPlatform: e.target.value },
                        },
                      }))
                    }
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="hubspot">HubSpot</option>
                    <option value="salesforce">Salesforce</option>
                    <option value="pipedrive">Pipedrive</option>
                    <option value="none">None yet</option>
                  </select>
                </div>
              )}

              {isEnabled && dept.key === "marketing" && "focus" in config && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Marketing Focus</p>
                  <div className="flex flex-wrap gap-2">
                    {["content", "seo", "paid_ads", "social"].map((focus) => (
                      <label
                        key={focus}
                        className="flex items-center gap-1 px-3 py-1 bg-white border rounded-full text-sm cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={(config.focus as string[]).includes(focus)}
                          onChange={(e) => {
                            const current = config.focus as string[];
                            const updated = e.target.checked
                              ? [...current, focus]
                              : current.filter((f) => f !== focus);
                            onChange((p) => ({
                              ...p,
                              phase3Departments: {
                                ...p.phase3Departments,
                                marketing: { ...config, focus: updated },
                              },
                            }));
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="capitalize">{focus.replace("_", " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Phase 4 Form: Roadmap
// ============================================================================

function Phase4Form({
  plan,
  onChange,
}: {
  plan: MasterPlan;
  onChange: (updater: (p: MasterPlan) => MasterPlan) => void;
}): JSX.Element {
  const p4 = plan.phase4Roadmap;

  return (
    <div className="space-y-6">
      {/* North Star Metric */}
      <section className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-gray-900">North Star Metric</h3>
        <input
          type="text"
          value={p4.northStarMetric}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              phase4Roadmap: { ...p.phase4Roadmap, northStarMetric: e.target.value },
            }))
          }
          className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
        />
      </section>

      {/* Milestones */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pre-loaded Milestones</h3>
        
        <div className="space-y-3">
          {p4.monthly.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{milestone.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {milestone.deliverables.map((d) => (
                      <span
                        key={d}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <select
                  value={milestone.status}
                  onChange={(e) => {
                    const updated = p4.monthly.map((m) =>
                      m.id === milestone.id
                        ? { ...m, status: e.target.value as typeof m.status }
                        : m
                    );
                    onChange((p) => ({
                      ...p,
                      phase4Roadmap: { ...p.phase4Roadmap, monthly: updated },
                    }));
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed ✓</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KPIs Preview */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Target KPIs (Shadow Defaults)</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(REAL_ESTATE_AI_KPIS)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {typeof value === "object" && "target" in value
                    ? typeof value.target === "number" && value.target < 1
                      ? `${(value.target * 100).toFixed(0)}%`
                      : String(value.target)
                    : "—"}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default MasterPlanWizard;
