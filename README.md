# OpenAI Agents

A comprehensive Node.js library for building intelligent agents using OpenAI's API. Create specialized AI agents, manage conversations, and orchestrate multi-agent collaborations with ease.

## 🚀 Features

- **Easy Agent Creation**: Simple API for creating AI agents with custom personalities and capabilities
- **Specialized Agents**: Pre-configured agents for specific domains (coding, writing, analysis)
- **Agent Management**: Manage multiple agents and switch between them seamlessly
- **Conversation History**: Automatic conversation tracking and management
- **Agent Orchestration**: Enable multiple agents to collaborate on complex tasks
- **TypeScript Ready**: Built with ES modules and modern JavaScript features

## 📦 Installation

```bash
npm install
```

## 🔧 Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

3. Add your API key to the `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 Quick Start

### Basic Agent

```javascript
import { Agent } from './index.js';

const agent = new Agent({
  name: 'Helper',
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7
});

const response = await agent.chat('What is the capital of France?');
console.log(response);
```

### Specialized Agents

```javascript
import { Agent } from './index.js';

// Create specialized agents
const coder = Agent.createSpecialized('coder');
const writer = Agent.createSpecialized('writer');
const analyst = Agent.createSpecialized('analyst');

// Use them for domain-specific tasks
const code = await coder.chat('Write a function to sort an array');
const article = await writer.chat('Write about machine learning');
const insights = await analyst.chat('Analyze this data trend');
```

### Agent Manager

```javascript
import { AgentManager } from './index.js';

const manager = new AgentManager();

// Create and register agents
manager.createSpecializedAgent('dev', 'coder');
manager.createSpecializedAgent('designer', 'writer');

// Switch between agents
manager.setCurrentAgent('dev');
let response = await manager.chat('How to implement authentication?');

manager.setCurrentAgent('designer');
response = await manager.chat('Design a login page');

// Chat with specific agents
response = await manager.chatWithAgent('dev', 'Review this code');
```

### Multi-Agent Orchestration

```javascript
import { AgentManager } from './index.js';

const manager = new AgentManager();
manager.createSpecializedAgent('pm', 'analyst');
manager.createSpecializedAgent('dev', 'coder');
manager.createSpecializedAgent('designer', 'writer');

// Orchestrate collaboration
const collaboration = await manager.orchestrateConversation(
  ['pm', 'dev', 'designer'],
  'Let\'s plan a new mobile app',
  3 // number of rounds
);

console.log('Collaboration results:', collaboration);
```

## 📚 API Reference

### Agent Class

#### Constructor
```javascript
new Agent(config)
```

**Config Options:**
- `name` (string): Agent's name
- `systemPrompt` (string): System prompt defining agent behavior
- `model` (string): OpenAI model to use (default: 'gpt-3.5-turbo')
- `temperature` (number): Response randomness (default: 0.7)
- `maxTokens` (number): Maximum response length (default: 1000)
- `apiKey` (string): OpenAI API key (defaults to env variable)

#### Methods

**`chat(message, options)`**
Send a message to the agent and get a response.

**`clearHistory()`**
Clear the conversation history.

**`getHistory()`**
Get the current conversation history.

**`setSystemPrompt(prompt)`**
Update the agent's system prompt.

**`Agent.createSpecialized(type, config)`** (Static)
Create a specialized agent. Types: 'coder', 'writer', 'analyst'.

### AgentManager Class

#### Methods

**`registerAgent(id, agent)`**
Register an existing agent with an ID.

**`createAgent(id, config)`**
Create and register a new agent.

**`createSpecializedAgent(id, type, config)`**
Create and register a specialized agent.

**`getAgent(id)`**
Get an agent by ID.

**`setCurrentAgent(id)`**
Set the active agent for chat operations.

**`chat(message, options)`**
Chat with the current active agent.

**`chatWithAgent(agentId, message, options)`**
Chat with a specific agent by ID.

**`getAgentIds()`**
Get all registered agent IDs.

**`removeAgent(id)`**
Remove an agent from the manager.

**`clearAgents()`**
Remove all agents from the manager.

**`orchestrateConversation(agentIds, initialMessage, maxRounds)`**
Orchestrate a conversation between multiple agents.

## 🎨 Examples

Run the included examples to see the library in action:

```bash
# Basic agent usage
npm start

# Specialized agents demo
node examples/specialized-agents.js

# Multi-agent orchestration
node examples/agent-orchestration.js
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## 🛠️ Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file
4. Run examples: `npm start`
5. Run tests: `npm test`

## 📄 License

ISC License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.