import { Agent, AgentManager } from '../index.js';

/**
 * Demo - Showcase library structure without API calls
 * Demonstrates the API and structure of the OpenAI Agents library
 */

function demoWithoutAPI() {
  console.log('🎪 OpenAI Agents Library Demo (No API Required)\n');

  try {
    // Create basic agent
    console.log('1. 📦 Creating Basic Agent:');
    const agent = new Agent({
      name: 'Demo Agent',
      systemPrompt: 'You are a helpful assistant for demonstrations.',
      apiKey: 'demo-key' // Won't make actual calls in this demo
    });
    
    console.log(`   ✅ Agent created: ${agent.name}`);
    console.log(`   ✅ System prompt: ${agent.systemPrompt}`);
    console.log(`   ✅ Model: ${agent.model}`);
    console.log(`   ✅ Temperature: ${agent.temperature}`);
    console.log(`   ✅ Max tokens: ${agent.maxTokens}\n`);

    // Demo conversation history management
    console.log('2. 💾 Conversation History Management:');
    console.log(`   ✅ Initial history length: ${agent.getHistory().length}`);
    
    // Simulate adding to history (normally done by chat method)
    agent.conversationHistory.push(
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there!' }
    );
    console.log(`   ✅ After simulation: ${agent.getHistory().length} messages`);
    
    agent.clearHistory();
    console.log(`   ✅ After clear: ${agent.getHistory().length} messages\n`);

    // Create specialized agents
    console.log('3. 🎯 Creating Specialized Agents:');
    const coder = Agent.createSpecialized('coder', { apiKey: 'demo-key' });
    const writer = Agent.createSpecialized('writer', { apiKey: 'demo-key' });
    const analyst = Agent.createSpecialized('analyst', { apiKey: 'demo-key' });
    
    console.log(`   ✅ Coder: ${coder.name}`);
    console.log(`   ✅ Writer: ${writer.name}`);
    console.log(`   ✅ Analyst: ${analyst.name}\n`);

    // Agent Manager demo
    console.log('4. 👥 Agent Manager Demo:');
    const manager = new AgentManager();
    
    manager.registerAgent('basic', agent);
    manager.registerAgent('coder', coder);
    manager.registerAgent('writer', writer);
    
    console.log(`   ✅ Registered agents: ${manager.getAgentIds().join(', ')}`);
    
    manager.setCurrentAgent('coder');
    console.log(`   ✅ Current agent set to: ${manager.getAgent('coder').name}`);
    
    const retrievedAgent = manager.getAgent('writer');
    console.log(`   ✅ Retrieved agent: ${retrievedAgent.name}`);
    
    console.log(`   ✅ Total agents managed: ${manager.getAgentIds().length}\n`);

    // API structure demo
    console.log('5. 🔧 API Methods Available:');
    console.log('   Agent methods:');
    console.log('   - chat(message, options) - Send message to agent');
    console.log('   - clearHistory() - Clear conversation');
    console.log('   - getHistory() - Get conversation history');
    console.log('   - setSystemPrompt(prompt) - Update system prompt');
    console.log('   - Agent.createSpecialized(type) - Create specialized agent\n');
    
    console.log('   AgentManager methods:');
    console.log('   - registerAgent(id, agent) - Register an agent');
    console.log('   - createAgent(id, config) - Create and register agent');
    console.log('   - setCurrentAgent(id) - Set active agent');
    console.log('   - chat(message) - Chat with current agent');
    console.log('   - chatWithAgent(id, message) - Chat with specific agent');
    console.log('   - orchestrateConversation(ids, message, rounds) - Multi-agent chat\n');

    // Configuration options
    console.log('6. ⚙️  Configuration Options:');
    console.log('   Agent config: name, systemPrompt, model, temperature, maxTokens, apiKey');
    console.log('   Specialized types: "coder", "writer", "analyst"');
    console.log('   Models supported: Any OpenAI chat model (gpt-3.5-turbo, gpt-4, etc.)\n');

    console.log('✨ Demo completed! The library is ready for use with your OpenAI API key.');
    console.log('📖 See README.md for complete documentation and usage examples.');

  } catch (error) {
    console.error('❌ Demo error:', error.message);
  }
}

// Run the demo
demoWithoutAPI();