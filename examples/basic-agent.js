import 'dotenv/config';
import { Agent } from '../src/Agent.js';

/**
 * Basic Agent Example
 * Demonstrates how to create and use a simple OpenAI Agent
 */

async function basicAgentExample() {
  console.log('🤖 Basic OpenAI Agent Example\n');

  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Please set your OPENAI_API_KEY environment variable');
    console.log('   You can create a .env file with: OPENAI_API_KEY=your_api_key_here\n');
    return;
  }

  try {
    // Create a basic agent
    const agent = new Agent({
      name: 'Helper Bot',
      systemPrompt: 'You are a friendly and helpful assistant. Keep responses concise but informative.',
      temperature: 0.7
    });

    console.log(`Agent created: ${agent.name}`);
    console.log(`System prompt: ${agent.systemPrompt}\n`);

    // Example conversation
    const questions = [
      "What is the capital of France?",
      "Can you explain what that city is famous for?",
      "Thank you for the information!"
    ];

    for (const question of questions) {
      console.log(`👤 User: ${question}`);
      
      try {
        const response = await agent.chat(question);
        console.log(`🤖 ${agent.name}: ${response}\n`);
      } catch (error) {
        console.error('❌ Error getting response:', error.message);
        break;
      }
    }

    // Show conversation history
    console.log('📝 Conversation History:');
    const history = agent.getHistory();
    history.forEach((msg, index) => {
      const role = msg.role === 'user' ? '👤' : '🤖';
      console.log(`${index + 1}. ${role} ${msg.role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  basicAgentExample().catch(console.error);
}