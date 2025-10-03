import { AgentManager } from '../src/AgentManager.js';
import { Agent } from '../src/Agent.js';

// Mock OpenAI for testing
jest.mock('openai');

describe('AgentManager', () => {
  let manager;
  let mockAgent;

  beforeEach(() => {
    manager = new AgentManager();
    
    // Mock agent
    mockAgent = {
      name: 'Mock Agent',
      chat: jest.fn().mockResolvedValue('Mock response')
    };
    
    // Make mockAgent an instance of Agent for instanceof check
    Object.setPrototypeOf(mockAgent, Agent.prototype);
  });

  describe('Agent Registration', () => {
    test('should register agent successfully', () => {
      manager.registerAgent('test', mockAgent);
      expect(manager.getAgent('test')).toBe(mockAgent);
    });

    test('should throw error for non-Agent instance', () => {
      const invalidAgent = { name: 'Invalid' };
      expect(() => manager.registerAgent('invalid', invalidAgent))
        .toThrow('Agent must be an instance of the Agent class');
    });

    test('should create and register new agent', () => {
      // Mock OpenAI constructor
      const { default: OpenAI } = require('openai');
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } }
      }));

      const agent = manager.createAgent('new', {
        name: 'New Agent',
        apiKey: 'test-key'
      });

      expect(agent).toBeInstanceOf(Agent);
      expect(manager.getAgent('new')).toBe(agent);
    });

    test('should create specialized agent', () => {
      // Mock OpenAI constructor
      const { default: OpenAI } = require('openai');
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } }
      }));

      const agent = manager.createSpecializedAgent('coder', 'coder', {
        apiKey: 'test-key'
      });

      expect(agent).toBeInstanceOf(Agent);
      expect(manager.getAgent('coder')).toBe(agent);
    });
  });

  describe('Agent Management', () => {
    beforeEach(() => {
      manager.registerAgent('test1', mockAgent);
    });

    test('should return null for non-existent agent', () => {
      expect(manager.getAgent('nonexistent')).toBeNull();
    });

    test('should set current agent', () => {
      manager.setCurrentAgent('test1');
      expect(manager.currentAgent).toBe(mockAgent);
    });

    test('should throw error when setting non-existent current agent', () => {
      expect(() => manager.setCurrentAgent('nonexistent'))
        .toThrow("Agent with id 'nonexistent' not found");
    });

    test('should get agent IDs', () => {
      manager.registerAgent('test2', mockAgent);
      const ids = manager.getAgentIds();
      expect(ids).toContain('test1');
      expect(ids).toContain('test2');
      expect(ids).toHaveLength(2);
    });

    test('should remove agent', () => {
      expect(manager.removeAgent('test1')).toBe(true);
      expect(manager.getAgent('test1')).toBeNull();
      expect(manager.removeAgent('nonexistent')).toBe(false);
    });

    test('should clear current agent when removed', () => {
      manager.setCurrentAgent('test1');
      manager.removeAgent('test1');
      expect(manager.currentAgent).toBeNull();
    });

    test('should clear all agents', () => {
      manager.registerAgent('test2', mockAgent);
      manager.setCurrentAgent('test1');
      
      manager.clearAgents();
      
      expect(manager.getAgentIds()).toHaveLength(0);
      expect(manager.currentAgent).toBeNull();
    });
  });

  describe('Chat Operations', () => {
    beforeEach(() => {
      manager.registerAgent('test', mockAgent);
    });

    test('should chat with current agent', async () => {
      manager.setCurrentAgent('test');
      const response = await manager.chat('Hello');
      
      expect(mockAgent.chat).toHaveBeenCalledWith('Hello', {});
      expect(response).toBe('Mock response');
    });

    test('should throw error when no current agent set', async () => {
      await expect(manager.chat('Hello'))
        .rejects.toThrow('No current agent set. Use setCurrentAgent() first.');
    });

    test('should chat with specific agent', async () => {
      const response = await manager.chatWithAgent('test', 'Hello', { temp: 0.5 });
      
      expect(mockAgent.chat).toHaveBeenCalledWith('Hello', { temp: 0.5 });
      expect(response).toBe('Mock response');
    });

    test('should throw error when chatting with non-existent agent', async () => {
      await expect(manager.chatWithAgent('nonexistent', 'Hello'))
        .rejects.toThrow("Agent with id 'nonexistent' not found");
    });
  });

  describe('Orchestration', () => {
    let agent1, agent2;

    beforeEach(() => {
      agent1 = {
        name: 'Agent 1',
        chat: jest.fn()
      };
      agent2 = {
        name: 'Agent 2', 
        chat: jest.fn()
      };

      // Make them instances of Agent
      Object.setPrototypeOf(agent1, Agent.prototype);
      Object.setPrototypeOf(agent2, Agent.prototype);

      manager.registerAgent('agent1', agent1);
      manager.registerAgent('agent2', agent2);
    });

    test('should orchestrate conversation between agents', async () => {
      agent1.chat.mockResolvedValueOnce('Response 1');
      agent2.chat.mockResolvedValueOnce('Response 2');
      agent1.chat.mockResolvedValueOnce('Response 3');
      agent2.chat.mockResolvedValueOnce('Response 4');

      const conversation = await manager.orchestrateConversation(
        ['agent1', 'agent2'], 
        'Initial message', 
        2
      );

      expect(conversation).toHaveLength(4);
      expect(conversation[0].agentId).toBe('agent1');
      expect(conversation[0].message).toBe('Initial message');
      expect(conversation[0].response).toBe('Response 1');
      expect(conversation[1].agentId).toBe('agent2');
      expect(conversation[1].message).toBe('Response 1');
    });

    test('should handle errors in orchestration', async () => {
      agent1.chat.mockResolvedValue('Good response');
      agent2.chat.mockRejectedValue(new Error('Agent error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const conversation = await manager.orchestrateConversation(
        ['agent1', 'agent2'], 
        'Initial message', 
        1
      );

      expect(conversation).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error with agent agent2:', 
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    test('should skip non-existent agents in orchestration', async () => {
      agent1.chat.mockResolvedValue('Response');

      const conversation = await manager.orchestrateConversation(
        ['agent1', 'nonexistent'], 
        'Initial message', 
        1
      );

      expect(conversation).toHaveLength(1);
      expect(conversation[0].agentId).toBe('agent1');
    });
  });
});