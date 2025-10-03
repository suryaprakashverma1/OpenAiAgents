import OpenAI from 'openai';

/**
 * Basic OpenAI Agent implementation
 * Provides a foundation for creating AI agents with OpenAI's API
 */
export class Agent {
  constructor(config = {}) {
    this.name = config.name || 'Assistant';
    this.systemPrompt = config.systemPrompt || 'You are a helpful AI assistant.';
    this.model = config.model || 'gpt-3.5-turbo';
    this.maxTokens = config.maxTokens || 1000;
    this.temperature = config.temperature || 0.7;
    
    this.openai = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
    });
    
    this.conversationHistory = [];
  }

  /**
   * Send a message to the agent and get a response
   * @param {string} message - The user message
   * @param {Object} options - Additional options for the request
   * @returns {Promise<string>} The agent's response
   */
  async chat(message, options = {}) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Prepare messages for OpenAI API
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory
      ];

      // Make API call
      const response = await this.openai.chat.completions.create({
        model: options.model || this.model,
        messages: messages,
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
      });

      const assistantResponse = response.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;
    } catch (error) {
      console.error('Error in agent chat:', error);
      throw error;
    }
  }

  /**
   * Clear the conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get the current conversation history
   * @returns {Array} The conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Set a new system prompt
   * @param {string} prompt - The new system prompt
   */
  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }

  /**
   * Create a specialized agent with predefined behavior
   * @param {string} type - The type of specialized agent
   * @returns {Agent} A new specialized agent instance
   */
  static createSpecialized(type, config = {}) {
    const specializedConfigs = {
      coder: {
        name: 'Code Assistant',
        systemPrompt: 'You are an expert programmer. Help users with coding questions, debug issues, and write clean, efficient code. Always explain your reasoning and provide examples when helpful.',
        ...config
      },
      writer: {
        name: 'Writing Assistant',
        systemPrompt: 'You are a professional writing assistant. Help users improve their writing, create content, and communicate effectively. Focus on clarity, style, and engagement.',
        ...config
      },
      analyst: {
        name: 'Data Analyst',
        systemPrompt: 'You are a data analyst and researcher. Help users understand data, create insights, and make data-driven decisions. Provide clear explanations and actionable recommendations.',
        ...config
      }
    };

    const specializedConfig = specializedConfigs[type] || specializedConfigs.coder;
    return new Agent(specializedConfig);
  }
}

export default Agent;