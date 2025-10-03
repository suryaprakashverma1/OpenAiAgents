import { Agent } from '../src/Agent.js';

// Mock OpenAI for testing
jest.mock('openai');

describe('Agent', () => {
  let mockOpenAI;
  let agent;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock OpenAI response
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: 'Mock response from OpenAI'
              }
            }]
          })
        }
      }
    };

    // Mock the OpenAI constructor
    const { default: OpenAI } = require('openai');
    OpenAI.mockImplementation(() => mockOpenAI);

    agent = new Agent({
      name: 'Test Agent',
      systemPrompt: 'Test system prompt',
      apiKey: 'test-key'
    });
  });

  describe('Constructor', () => {
    test('should create agent with default values', () => {
      const defaultAgent = new Agent();
      expect(defaultAgent.name).toBe('Assistant');
      expect(defaultAgent.systemPrompt).toBe('You are a helpful AI assistant.');
      expect(defaultAgent.model).toBe('gpt-3.5-turbo');
    });

    test('should create agent with custom config', () => {
      expect(agent.name).toBe('Test Agent');
      expect(agent.systemPrompt).toBe('Test system prompt');
    });

    test('should initialize empty conversation history', () => {
      expect(agent.getHistory()).toEqual([]);
    });
  });

  describe('chat', () => {
    test('should send message and return response', async () => {
      const message = 'Hello, how are you?';
      const response = await agent.chat(message);

      expect(response).toBe('Mock response from OpenAI');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Test system prompt' },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });
    });

    test('should add messages to conversation history', async () => {
      await agent.chat('First message');
      await agent.chat('Second message');

      const history = agent.getHistory();
      expect(history).toHaveLength(4); // 2 user + 2 assistant messages
      expect(history[0].role).toBe('user');
      expect(history[0].content).toBe('First message');
      expect(history[1].role).toBe('assistant');
      expect(history[2].role).toBe('user');
      expect(history[2].content).toBe('Second message');
    });

    test('should handle API errors', async () => {
      const error = new Error('API Error');
      mockOpenAI.chat.completions.create.mockRejectedValue(error);

      await expect(agent.chat('Test message')).rejects.toThrow('API Error');
    });

    test('should use custom options', async () => {
      await agent.chat('Test', {
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 500
      });

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: expect.any(Array),
        max_tokens: 500,
        temperature: 0.5
      });
    });
  });

  describe('conversation management', () => {
    test('should clear conversation history', async () => {
      await agent.chat('Test message');
      expect(agent.getHistory()).toHaveLength(2);

      agent.clearHistory();
      expect(agent.getHistory()).toHaveLength(0);
    });

    test('should set new system prompt', () => {
      const newPrompt = 'New system prompt';
      agent.setSystemPrompt(newPrompt);
      expect(agent.systemPrompt).toBe(newPrompt);
    });

    test('should return copy of history', () => {
      const history = agent.getHistory();
      history.push({ role: 'test', content: 'test' });
      
      expect(agent.getHistory()).not.toContain({ role: 'test', content: 'test' });
    });
  });

  describe('specialized agents', () => {
    test('should create coder agent', () => {
      const coder = Agent.createSpecialized('coder');
      expect(coder.name).toBe('Code Assistant');
      expect(coder.systemPrompt).toContain('programmer');
    });

    test('should create writer agent', () => {
      const writer = Agent.createSpecialized('writer');
      expect(writer.name).toBe('Writing Assistant');
      expect(writer.systemPrompt).toContain('writing');
    });

    test('should create analyst agent', () => {
      const analyst = Agent.createSpecialized('analyst');
      expect(analyst.name).toBe('Data Analyst');
      expect(analyst.systemPrompt).toContain('data');
    });

    test('should fallback to coder for unknown type', () => {
      const unknown = Agent.createSpecialized('unknown');
      expect(unknown.name).toBe('Code Assistant');
    });

    test('should merge custom config with specialized config', () => {
      const coder = Agent.createSpecialized('coder', {
        name: 'Custom Coder',
        temperature: 0.9
      });
      expect(coder.name).toBe('Custom Coder');
      expect(coder.temperature).toBe(0.9);
    });
  });
});