import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export common utilities
export { clsx, twMerge };

// UI Components
export * from "./components/ui/avatar";
export * from "./components/ui/badge";
export * from "./components/ui/button";
export * from "./components/ui/calendar";
export * from "./components/ui/card";
export * from "./components/ui/checkbox";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/input";
export * from "./components/ui/label";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/skeleton";
export * from "./components/ui/textarea";
export * from "./components/ui/toast";
export * from "./components/ui/tooltip";
export * from "./components/ui/use-toast";

// Block Components
export * from "./components/blocks/brief-block";
export * from "./components/blocks/calendar-block";
export * from "./components/blocks/crm-block";
export * from "./components/blocks/inbox-block";
export * from "./components/blocks/legal-block";
export * from "./components/blocks/task-block";
export * from "./components/blocks/vault-block";
export * from "./components/blocks/voice-minutes-block";

// Dashboard Components
export * from "./components/dashboard/block-grid";
export * from "./components/dashboard/briefing-card";
export * from "./components/dashboard/metric-cards";
// Dashboard Shell moved to dashboard-shell.tsx for App Router compatibility
export * from "./components/dashboard/sidebar";
export * from "./components/dashboard/top-nav";

// Layout Components
export * from "./components/dashboard-layout";
export { default as Layout } from "./components/Layout";
export * from "./components/dashboard-shell";

// Providers
export * from "./providers/supabase-provider";
