import { Agent } from './Agent.js';

/**
 * AgentManager - Manages multiple agents and their interactions
 * Enables orchestration of multiple specialized agents
 */
export class AgentManager {
  constructor() {
    this.agents = new Map();
    this.currentAgent = null;
  }

  /**
   * Register a new agent with the manager
   * @param {string} id - Unique identifier for the agent
   * @param {Agent} agent - The agent instance
   */
  registerAgent(id, agent) {
    if (!(agent instanceof Agent)) {
      throw new Error('Agent must be an instance of the Agent class');
    }
    this.agents.set(id, agent);
  }

  /**
   * Create and register a new agent
   * @param {string} id - Unique identifier for the agent
   * @param {Object} config - Configuration for the agent
   * @returns {Agent} The created agent
   */
  createAgent(id, config = {}) {
    const agent = new Agent(config);
    this.registerAgent(id, agent);
    return agent;
  }

  /**
   * Create and register a specialized agent
   * @param {string} id - Unique identifier for the agent
   * @param {string} type - Type of specialized agent (coder, writer, analyst)
   * @param {Object} config - Additional configuration
   * @returns {Agent} The created specialized agent
   */
  createSpecializedAgent(id, type, config = {}) {
    const agent = Agent.createSpecialized(type, config);
    this.registerAgent(id, agent);
    return agent;
  }

  /**
   * Get an agent by ID
   * @param {string} id - The agent ID
   * @returns {Agent|null} The agent instance or null if not found
   */
  getAgent(id) {
    return this.agents.get(id) || null;
  }

  /**
   * Set the current active agent
   * @param {string} id - The agent ID
   */
  setCurrentAgent(id) {
    const agent = this.getAgent(id);
    if (!agent) {
      throw new Error(`Agent with id '${id}' not found`);
    }
    this.currentAgent = agent;
  }

  /**
   * Send a message to the current agent
   * @param {string} message - The message to send
   * @param {Object} options - Additional options
   * @returns {Promise<string>} The agent's response
   */
  async chat(message, options = {}) {
    if (!this.currentAgent) {
      throw new Error('No current agent set. Use setCurrentAgent() first.');
    }
    return await this.currentAgent.chat(message, options);
  }

  /**
   * Send a message to a specific agent
   * @param {string} agentId - The agent ID
   * @param {string} message - The message to send
   * @param {Object} options - Additional options
   * @returns {Promise<string>} The agent's response
   */
  async chatWithAgent(agentId, message, options = {}) {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent with id '${agentId}' not found`);
    }
    return await agent.chat(message, options);
  }

  /**
   * Get a list of all registered agent IDs
   * @returns {Array<string>} Array of agent IDs
   */
  getAgentIds() {
    return Array.from(this.agents.keys());
  }

  /**
   * Remove an agent from the manager
   * @param {string} id - The agent ID to remove
   * @returns {boolean} True if agent was removed, false if not found
   */
  removeAgent(id) {
    if (this.currentAgent === this.agents.get(id)) {
      this.currentAgent = null;
    }
    return this.agents.delete(id);
  }

  /**
   * Clear all agents from the manager
   */
  clearAgents() {
    this.agents.clear();
    this.currentAgent = null;
  }

  /**
   * Orchestrate a conversation between multiple agents
   * @param {Array<string>} agentIds - IDs of agents to participate
   * @param {string} initialMessage - The initial message to start the conversation
   * @param {number} maxRounds - Maximum number of conversation rounds
   * @returns {Promise<Array>} Array of conversation exchanges
   */
  async orchestrateConversation(agentIds, initialMessage, maxRounds = 3) {
    const conversation = [];
    let currentMessage = initialMessage;

    for (let round = 0; round < maxRounds; round++) {
      for (const agentId of agentIds) {
        const agent = this.getAgent(agentId);
        if (!agent) continue;

        try {
          const response = await agent.chat(currentMessage);
          conversation.push({
            round: round + 1,
            agentId,
            agentName: agent.name,
            message: currentMessage,
            response
          });
          currentMessage = response;
        } catch (error) {
          console.error(`Error with agent ${agentId}:`, error);
        }
      }
    }

    return conversation;
  }
}

export default AgentManager;