/**
 * Chaos Testing Utilities
 * 
 * This module provides utilities for chaos engineering testing:
 * - Backend failure simulation
 * - Data corruption simulation  
 * - Latency injection
 * 
 * These are controlled via feature flags and environment variables.
 */

// Chaos testing module - no external dependencies needed

// Chaos testing configuration
interface ChaosConfig {
  enabled: boolean;
  backendFailureRate: number; // 0-1 probability of network failure
  dataCorruptionRate: number; // 0-1 probability of returning invalid JSON
  latencyMs: number; // Artificial delay in milliseconds
  latencyJitterMs: number; // Random jitter added to latency
}

// Default config (all chaos disabled)
const defaultConfig: ChaosConfig = {
  enabled: false,
  backendFailureRate: 0,
  dataCorruptionRate: 0,
  latencyMs: 0,
  latencyJitterMs: 0,
};

// Current chaos configuration
let chaosConfig: ChaosConfig = { ...defaultConfig };

/**
 * Enable chaos testing with specified configuration
 */
export function enableChaos(config: Partial<ChaosConfig>): void {
  chaosConfig = {
    ...defaultConfig,
    enabled: true,
    ...config,
  };
  console.warn("[CHAOS TESTING] Chaos mode enabled:", chaosConfig);
}

/**
 * Disable chaos testing
 */
export function disableChaos(): void {
  chaosConfig = { ...defaultConfig };
  console.log("[CHAOS TESTING] Chaos mode disabled");
}

/**
 * Get current chaos configuration
 */
export function getChaosConfig(): ChaosConfig {
  return { ...chaosConfig };
}

/**
 * Check if chaos testing is enabled
 */
export function isChaosEnabled(): boolean {
  return chaosConfig.enabled;
}

/**
 * Apply artificial latency
 */
async function applyLatency(): Promise<void> {
  if (chaosConfig.latencyMs <= 0) return;

  const jitter = Math.random() * chaosConfig.latencyJitterMs;
  const totalDelay = chaosConfig.latencyMs + jitter;
  
  console.log(`[CHAOS TESTING] Applying ${totalDelay.toFixed(0)}ms artificial latency`);
  await new Promise((resolve) => setTimeout(resolve, totalDelay));
}

/**
 * Simulate backend failure (network error)
 */
function simulateBackendFailure(): void {
  const shouldFail = Math.random() < chaosConfig.backendFailureRate;
  
  if (shouldFail) {
    console.warn("[CHAOS TESTING] Simulating backend failure (network error)");
    const error = new Error("Network Error: Backend is unreachable") as Error & { code: string };
    error.code = "ERR_NETWORK";
    throw error;
  }
}

/**
 * Simulate data corruption (invalid JSON)
 */
function simulateDataCorruption<T>(data: T): T {
  const shouldCorrupt = Math.random() < chaosConfig.dataCorruptionRate;
  
  if (shouldCorrupt) {
    console.warn("[CHAOS TESTING] Simulating data corruption (invalid JSON)");
    // Return corrupted data that will fail JSON parsing
    return "{ invalid json: missing quotes, trailing commas, }" as unknown as T;
  }
  
  return data;
}

/**
 * Wraps an API call with chaos injection
 */
export async function withChaos<T>(
  operation: () => Promise<T>,
  _operationName: string = "api call"
): Promise<T> {
  // Apply latency first
  if (chaosConfig.latencyMs > 0) {
    await applyLatency();
  }

  // Simulate backend failure
  if (chaosConfig.backendFailureRate > 0) {
    simulateBackendFailure();
  }

  // Execute the actual operation
  let result = await operation();

  // Simulate data corruption on the result
  if (chaosConfig.dataCorruptionRate > 0) {
    result = simulateDataCorruption(result);
  }

  return result;
}

/**
 * Chaos testing scenarios
 */
export const ChaosScenarios = {
  /**
   * Backend offline scenario - 100% network failure
   */
  backendOffline: (): void => {
    enableChaos({
      backendFailureRate: 1.0,
      dataCorruptionRate: 0,
      latencyMs: 0,
    });
  },

  /**
   * Data corruption scenario - 50% chance of invalid JSON
   */
  dataCorruption: (): void => {
    enableChaos({
      backendFailureRate: 0,
      dataCorruptionRate: 0.5,
      latencyMs: 0,
    });
  },

  /**
   * High latency scenario - 5 second delay
   */
  highLatency: (): void => {
    enableChaos({
      backendFailureRate: 0,
      dataCorruptionRate: 0,
      latencyMs: 5000,
      latencyJitterMs: 500,
    });
  },

  /**
   * Full chaos - combination of all failure modes
   */
  fullChaos: (): void => {
    enableChaos({
      backendFailureRate: 0.3,
      dataCorruptionRate: 0.2,
      latencyMs: 3000,
      latencyJitterMs: 1000,
    });
  },

  /**
   * Reset to normal operation
   */
  reset: (): void => {
    disableChaos();
  },
};

/**
 * Hook to get chaos status for UI indicators
 */
export function useChaosStatus(): { 
  enabled: boolean; 
  config: ChaosConfig;
  activeScenarios: string[];
} {
  const activeScenarios: string[] = [];
  
  if (!chaosConfig.enabled) {
    return { enabled: false, config: chaosConfig, activeScenarios };
  }

  if (chaosConfig.backendFailureRate > 0) {
    activeScenarios.push(`Backend Failure (${(chaosConfig.backendFailureRate * 100).toFixed(0)}%)`);
  }
  if (chaosConfig.dataCorruptionRate > 0) {
    activeScenarios.push(`Data Corruption (${(chaosConfig.dataCorruptionRate * 100).toFixed(0)}%)`);
  }
  if (chaosConfig.latencyMs > 0) {
    activeScenarios.push(`High Latency (${chaosConfig.latencyMs}ms)`);
  }

  return { enabled: true, config: chaosConfig, activeScenarios };
}

/**
 * Chaos indicator component props
 */
export interface ChaosIndicatorProps {
  className?: string;
}
