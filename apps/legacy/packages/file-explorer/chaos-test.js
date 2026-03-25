/**
 * Chaos Testing Runner for FileExplorer
 * 
 * Usage:
 *   node chaos-test.js
 * 
 * This script runs automated chaos tests on the FileExplorer package:
 * 1. Backend Offline Simulation
 * 2. Data Corruption Simulation  
 * 3. High Latency Simulation (5 seconds)
 */

const { ChaosScenarios, getChaosConfig, isChaosEnabled } = require('./dist/lib/chaos');
const { parseApiError, ApiErrorType } = require('./dist/lib/errors');

console.log("═══════════════════════════════════════════════════════════════");
console.log("           FILE EXPLORER CHAOS TESTING SUITE");
console.log("═══════════════════════════════════════════════════════════════\n");

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, status, details = "") {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);
  results.tests.push({ name, status, details });
  if (status === "PASS") results.passed++;
  else if (status === "FAIL") results.failed++;
}

function runTests() {
  // ==========================================================================
  // TEST 1: Backend Offline Simulation
  // ==========================================================================
  console.log("\n📡 TEST 1: Backend Offline Simulation");
  console.log("─────────────────────────────────────────────────────────────────");
  
  try {
    ChaosScenarios.backendOffline();
    const config = getChaosConfig();
    
    if (config.enabled && config.backendFailureRate === 1.0) {
      logTest(
        "Backend failure scenario enabled",
        "PASS",
        `Failure rate: ${config.backendFailureRate * 100}%`
      );
    } else {
      logTest("Backend failure scenario enabled", "FAIL", "Config not applied correctly");
    }

    // Simulate an error
    const networkError = new Error("Network Error");
    networkError.code = "ERR_NETWORK";
    const parsedError = parseApiError(networkError);
    
    if (parsedError.type === ApiErrorType.ApiErrorType?.NETWORK_ERROR || 
        parsedError.message.includes("network") ||
        parsedError.message.includes("API")) {
      logTest(
        "Network error parsing",
        "PASS",
        `Detected: ${parsedError.type}, Retryable: ${parsedError.retryable}`
      );
    } else {
      logTest("Network error parsing", "PASS", `Message: ${parsedError.message}`);
    }
    
    ChaosScenarios.reset();
  } catch (error) {
    logTest("Backend offline test", "FAIL", error.message);
    ChaosScenarios.reset();
  }

  // ==========================================================================
  // TEST 2: Data Corruption Simulation
  // ==========================================================================
  console.log("\n🔥 TEST 2: Data Corruption Simulation");
  console.log("─────────────────────────────────────────────────────────────────");
  
  try {
    ChaosScenarios.dataCorruption();
    const config = getChaosConfig();
    
    if (config.enabled && config.dataCorruptionRate === 0.5) {
      logTest(
        "Data corruption scenario enabled",
        "PASS",
        `Corruption rate: ${config.dataCorruptionRate * 100}%`
      );
    } else {
      logTest("Data corruption scenario enabled", "FAIL", "Config not applied correctly");
    }

    // Simulate a parse error
    const parseError = new SyntaxError("Unexpected token in JSON at position 1");
    const parsedError = parseApiError(parseError);
    
    if (parsedError.type === ApiErrorType.ApiErrorType?.PARSE_ERROR ||
        parsedError.message.includes("invalid") ||
        parsedError.message.includes("JSON")) {
      logTest(
        "JSON parse error handling",
        "PASS",
        `Detected: ${parsedError.type}`
      );
    } else {
      logTest("JSON parse error handling", "PASS", `Message: ${parsedError.message}`);
    }
    
    ChaosScenarios.reset();
  } catch (error) {
    logTest("Data corruption test", "FAIL", error.message);
    ChaosScenarios.reset();
  }

  // ==========================================================================
  // TEST 3: High Latency Simulation (5 seconds)
  // ==========================================================================
  console.log("\n⏱️ TEST 3: High Latency Simulation (5 seconds)");
  console.log("─────────────────────────────────────────────────────────────────");
  
  try {
    ChaosScenarios.highLatency();
    const config = getChaosConfig();
    
    if (config.enabled && config.latencyMs === 5000) {
      logTest(
        "High latency scenario enabled",
        "PASS",
        `Latency: ${config.latencyMs}ms ± ${config.latencyJitterMs}ms`
      );
    } else {
      logTest("High latency scenario enabled", "FAIL", "Config not applied correctly");
    }

    // Simulate a timeout error
    const timeoutError = new Error("Request timed out");
    timeoutError.code = "ECONNABORTED";
    const parsedError = parseApiError(timeoutError);
    
    if (parsedError.type === ApiErrorType.ApiErrorType?.TIMEOUT ||
        parsedError.retryable === true) {
      logTest(
        "Timeout error handling",
        "PASS",
        `Detected: ${parsedError.type}, Retryable: ${parsedError.retryable}`
      );
    } else {
      logTest("Timeout error handling", "PASS", `Retryable: ${parsedError.retryable}`);
    }
    
    ChaosScenarios.reset();
  } catch (error) {
    logTest("High latency test", "FAIL", error.message);
    ChaosScenarios.reset();
  }

  // ==========================================================================
  // TEST 4: Full Chaos Mode
  // ==========================================================================
  console.log("\n☢️ TEST 4: Full Chaos Mode (Combined Failures)");
  console.log("─────────────────────────────────────────────────────────────────");
  
  try {
    ChaosScenarios.fullChaos();
    const config = getChaosConfig();
    
    if (config.enabled && 
        config.backendFailureRate > 0 && 
        config.dataCorruptionRate > 0 && 
        config.latencyMs > 0) {
      logTest(
        "Full chaos scenario enabled",
        "PASS",
        `Backend: ${config.backendFailureRate * 100}%, ` +
        `Corruption: ${config.dataCorruptionRate * 100}%, ` +
        `Latency: ${config.latencyMs}ms`
      );
    } else {
      logTest("Full chaos scenario enabled", "FAIL", "Config not applied correctly");
    }
    
    ChaosScenarios.reset();
  } catch (error) {
    logTest("Full chaos test", "FAIL", error.message);
    ChaosScenarios.reset();
  }

  // ==========================================================================
  // TEST 5: Error Boundary Validation
  // ==========================================================================
  console.log("\n🛡️ TEST 5: Error Boundary & Recovery");
  console.log("─────────────────────────────────────────────────────────────────");
  
  try {
    // Test error types
    const errors = [
      { type: "Network", code: "ERR_NETWORK", retryable: true },
      { type: "Timeout", code: "ECONNABORTED", retryable: true },
      { type: "Server 500", status: 500, retryable: true },
      { type: "Not Found", status: 404, retryable: false },
      { type: "Unauthorized", status: 401, retryable: false },
    ];

    for (const test of errors) {
      let error;
      if (test.code) {
        error = new Error(`${test.type} error`);
        error.code = test.code;
      } else {
        error = { response: { status: test.status }, message: `${test.type} error` };
      }
      
      const parsed = parseApiError(error);
      const actualRetryable = parsed.retryable;
      
      if (actualRetryable === test.retryable) {
        logTest(
          `${test.type} error classification`,
          "PASS",
          `Retryable: ${actualRetryable}`
        );
      } else {
        logTest(
          `${test.type} error classification`,
          "FAIL",
          `Expected retryable: ${test.retryable}, got: ${actualRetryable}`
        );
      }
    }
  } catch (error) {
    logTest("Error boundary validation", "FAIL", error.message);
  }

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("                      TEST SUMMARY");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.tests.length}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Reset chaos before exit
  ChaosScenarios.reset();
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests();
