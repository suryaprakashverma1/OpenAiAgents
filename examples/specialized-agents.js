import 'dotenv/config';
import { Agent, AgentManager } from '../index.js';

/**
 * Specialized Agents Example
 * Demonstrates different types of specialized agents and their capabilities
 */

async function specializedAgentsExample() {
  console.log('🎯 Specialized OpenAI Agents Example\n');

  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Please set your OPENAI_API_KEY environment variable');
    return;
  }

  try {
    const manager = new AgentManager();

    // Create different specialized agents
    console.log('Creating specialized agents...\n');

    const coder = manager.createSpecializedAgent('coder', 'coder');
    console.log(`✅ Created: ${coder.name}`);

    const writer = manager.createSpecializedAgent('writer', 'writer');
    console.log(`✅ Created: ${writer.name}`);

    const analyst = manager.createSpecializedAgent('analyst', 'analyst');
    console.log(`✅ Created: ${analyst.name}\n`);

    // Demonstrate each agent's capabilities
    const demonstrations = [
      {
        agentId: 'coder',
        question: 'Can you write a simple Python function to calculate fibonacci numbers?',
        emoji: '💻'
      },
      {
        agentId: 'writer',
        question: 'Write a brief, engaging introduction for a blog post about artificial intelligence.',
        emoji: '✍️'
      },
      {
        agentId: 'analyst',
        question: 'What are the key metrics I should track for a SaaS business?',
        emoji: '📊'
      }
    ];

    for (const demo of demonstrations) {
      const agent = manager.getAgent(demo.agentId);
      console.log(`${demo.emoji} ${agent.name} Demo:`);
      console.log(`Question: ${demo.question}`);
      
      try {
        const response = await manager.chatWithAgent(demo.agentId, demo.question);
        console.log(`Response: ${response}\n`);
        console.log('---\n');
      } catch (error) {
        console.error(`❌ Error with ${demo.agentId}:`, error.message);
      }
    }

    // Demonstrate agent switching
    console.log('🔄 Agent Switching Demo:\n');
    
    manager.setCurrentAgent('coder');
    console.log(`Current agent set to: ${manager.getAgent('coder').name}`);
    
    let response = await manager.chat('What programming language would you recommend for beginners?');
    console.log(`Response: ${response}\n`);

    manager.setCurrentAgent('writer');
    console.log(`Current agent switched to: ${manager.getAgent('writer').name}`);
    
    response = await manager.chat('How can I improve my writing style?');
    console.log(`Response: ${response}\n`);

    console.log(`📋 Available agents: ${manager.getAgentIds().join(', ')}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  specializedAgentsExample().catch(console.error);
}