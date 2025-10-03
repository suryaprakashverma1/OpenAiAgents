import 'dotenv/config';
import { AgentManager } from '../index.js';

/**
 * Agent Orchestration Example
 * Demonstrates how multiple agents can collaborate on complex tasks
 */

async function agentOrchestrationExample() {
  console.log('🎭 Agent Orchestration Example\n');

  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Please set your OPENAI_API_KEY environment variable');
    return;
  }

  try {
    const manager = new AgentManager();

    // Create a team of specialized agents for a project
    console.log('🏗️  Creating project team...\n');

    // Product Manager Agent
    manager.createAgent('pm', {
      name: 'Product Manager',
      systemPrompt: 'You are an experienced product manager. Focus on user needs, business requirements, and project planning. Keep responses practical and business-oriented.',
      temperature: 0.6
    });

    // Developer Agent
    manager.createSpecializedAgent('dev', 'coder', {
      name: 'Senior Developer',
      systemPrompt: 'You are a senior software developer. Focus on technical implementation, best practices, and code architecture. Provide detailed technical guidance.',
      temperature: 0.4
    });

    // Designer Agent
    manager.createAgent('designer', {
      name: 'UX Designer',
      systemPrompt: 'You are a UX/UI designer. Focus on user experience, interface design, and usability. Think about user workflows and visual design principles.',
      temperature: 0.7
    });

    console.log('✅ Team created: Product Manager, Senior Developer, UX Designer\n');

    // Simulate a project planning session
    console.log('📋 Project Planning Session: "Build a Task Management App"\n');

    const projectBrief = "We need to build a simple task management app for small teams. The app should allow users to create, assign, and track tasks with due dates and priorities.";

    console.log(`Initial Project Brief: ${projectBrief}\n`);

    // Get input from each team member
    const teamInputs = [
      {
        agentId: 'pm',
        question: `${projectBrief} As the product manager, what are the key features and requirements we should prioritize?`
      },
      {
        agentId: 'designer',
        question: `Based on this task management app project, what should be the main user flows and interface considerations?`
      },
      {
        agentId: 'dev',
        question: `For this task management app, what would be the recommended technical architecture and technology stack?`
      }
    ];

    const responses = [];

    for (const input of teamInputs) {
      const agent = manager.getAgent(input.agentId);
      console.log(`💭 ${agent.name} Input:`);
      
      try {
        const response = await manager.chatWithAgent(input.agentId, input.question);
        responses.push({
          role: agent.name,
          response: response
        });
        console.log(`${response}\n`);
        console.log('---\n');
      } catch (error) {
        console.error(`❌ Error getting input from ${agent.name}:`, error.message);
      }
    }

    // Orchestrated collaboration
    console.log('🤝 Orchestrated Collaboration:\n');
    
    try {
      const collaboration = await manager.orchestrateConversation(
        ['pm', 'designer', 'dev'],
        'Let\'s discuss how we can integrate our different perspectives on this task management app. What potential challenges do you see?',
        2
      );

      collaboration.forEach((exchange, index) => {
        console.log(`Round ${exchange.round} - ${exchange.agentName}:`);
        console.log(`Input: ${exchange.message.substring(0, 100)}${exchange.message.length > 100 ? '...' : ''}`);
        console.log(`Response: ${exchange.response}\n`);
      });
    } catch (error) {
      console.error('❌ Error in orchestration:', error.message);
    }

    console.log('✨ Orchestration complete! The team has provided collaborative insights.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  agentOrchestrationExample().catch(console.error);
}