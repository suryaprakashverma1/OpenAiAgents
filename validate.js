#!/usr/bin/env node

/**
 * Basic validation script to ensure the library works correctly
 * Runs basic tests without complex Jest configuration
 */

import { Agent, AgentManager } from './index.js';

let testCount = 0;
let passCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🧪 Running OpenAI Agents Library Validation\n');

// Agent Class Tests
test('Agent constructor with defaults', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  assertEqual(agent.name, 'Assistant', 'Default name should be Assistant');
  assertEqual(agent.model, 'gpt-3.5-turbo', 'Default model should be gpt-3.5-turbo');
  assertEqual(agent.temperature, 0.7, 'Default temperature should be 0.7');
});

test('Agent constructor with custom config', () => {
  const agent = new Agent({
    name: 'Test Agent',
    systemPrompt: 'Test prompt',
    model: 'gpt-4',
    temperature: 0.5,
    maxTokens: 500,
    apiKey: 'test-key'
  });
  assertEqual(agent.name, 'Test Agent', 'Custom name should be set');
  assertEqual(agent.systemPrompt, 'Test prompt', 'Custom system prompt should be set');
  assertEqual(agent.model, 'gpt-4', 'Custom model should be set');
  assertEqual(agent.temperature, 0.5, 'Custom temperature should be set');
  assertEqual(agent.maxTokens, 500, 'Custom maxTokens should be set');
});

test('Agent conversation history', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  assertEqual(agent.getHistory().length, 0, 'Initial history should be empty');
  
  // Simulate conversation history
  agent.conversationHistory.push(
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' }
  );
  assertEqual(agent.getHistory().length, 2, 'History should have 2 messages');
  
  agent.clearHistory();
  assertEqual(agent.getHistory().length, 0, 'History should be cleared');
});

test('Agent setSystemPrompt', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  const newPrompt = 'New system prompt';
  agent.setSystemPrompt(newPrompt);
  assertEqual(agent.systemPrompt, newPrompt, 'System prompt should be updated');
});

test('Agent.createSpecialized - coder', () => {
  const coder = Agent.createSpecialized('coder', { apiKey: 'test-key' });
  assertEqual(coder.name, 'Code Assistant', 'Coder agent should have correct name');
  assertTrue(coder.systemPrompt.includes('programmer'), 'Coder should have programming prompt');
});

test('Agent.createSpecialized - writer', () => {
  const writer = Agent.createSpecialized('writer', { apiKey: 'test-key' });
  assertEqual(writer.name, 'Writing Assistant', 'Writer agent should have correct name');
  assertTrue(writer.systemPrompt.includes('writing'), 'Writer should have writing prompt');
});

test('Agent.createSpecialized - analyst', () => {
  const analyst = Agent.createSpecialized('analyst', { apiKey: 'test-key' });
  assertEqual(analyst.name, 'Data Analyst', 'Analyst agent should have correct name');
  assertTrue(analyst.systemPrompt.includes('data'), 'Analyst should have data prompt');
});

// AgentManager Tests
test('AgentManager constructor', () => {
  const manager = new AgentManager();
  assertEqual(manager.getAgentIds().length, 0, 'Manager should start with no agents');
  assertEqual(manager.currentAgent, null, 'No current agent should be set initially');
});

test('AgentManager registerAgent', () => {
  const manager = new AgentManager();
  const agent = new Agent({ apiKey: 'test-key' });
  
  manager.registerAgent('test', agent);
  assertEqual(manager.getAgent('test'), agent, 'Agent should be registered');
  assertTrue(manager.getAgentIds().includes('test'), 'Agent ID should be in list');
});

test('AgentManager registerAgent validation', () => {
  const manager = new AgentManager();
  const invalidAgent = { name: 'Invalid' };
  
  try {
    manager.registerAgent('invalid', invalidAgent);
    throw new Error('Should have thrown error for invalid agent');
  } catch (error) {
    assertTrue(error.message.includes('Agent must be an instance'), 'Should validate agent type');
  }
});

test('AgentManager createAgent', () => {
  const manager = new AgentManager();
  const agent = manager.createAgent('new', {
    name: 'New Agent',
    apiKey: 'test-key'
  });
  
  assertTrue(agent instanceof Agent, 'Should create Agent instance');
  assertEqual(manager.getAgent('new'), agent, 'Should register created agent');
});

test('AgentManager setCurrentAgent', () => {
  const manager = new AgentManager();
  const agent = new Agent({ apiKey: 'test-key' });
  manager.registerAgent('test', agent);
  
  manager.setCurrentAgent('test');
  assertEqual(manager.currentAgent, agent, 'Current agent should be set');
});

test('AgentManager setCurrentAgent - nonexistent', () => {
  const manager = new AgentManager();
  
  try {
    manager.setCurrentAgent('nonexistent');
    throw new Error('Should have thrown error');
  } catch (error) {
    assertTrue(error.message.includes('not found'), 'Should throw error for nonexistent agent');
  }
});

test('AgentManager removeAgent', () => {
  const manager = new AgentManager();
  const agent = new Agent({ apiKey: 'test-key' });
  manager.registerAgent('test', agent);
  
  assertTrue(manager.removeAgent('test'), 'Should return true when removing existing agent');
  assertEqual(manager.getAgent('test'), null, 'Agent should be removed');
  assertTrue(!manager.removeAgent('nonexistent'), 'Should return false for nonexistent agent');
});

test('AgentManager clearAgents', () => {
  const manager = new AgentManager();
  manager.createAgent('agent1', { apiKey: 'test-key' });
  manager.createAgent('agent2', { apiKey: 'test-key' });
  manager.setCurrentAgent('agent1');
  
  manager.clearAgents();
  assertEqual(manager.getAgentIds().length, 0, 'All agents should be removed');
  assertEqual(manager.currentAgent, null, 'Current agent should be null');
});

// Module Exports Test
test('Module exports', () => {
  assertTrue(typeof Agent === 'function', 'Agent should be exported as function');
  assertTrue(typeof AgentManager === 'function', 'AgentManager should be exported as function');
});

console.log(`\n📊 Test Results: ${passCount}/${testCount} passed`);

if (passCount === testCount) {
  console.log('🎉 All tests passed! The library is working correctly.');
  process.exit(0);
} else {
  console.log('💥 Some tests failed. Please check the implementation.');
  process.exit(1);
}