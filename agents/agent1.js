import OpenAI from 'openai';

export class Agent1 {
  constructor(apiKey) {
    this.demoMode = !apiKey || apiKey === 'demo';
    if (!this.demoMode) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateResponses(userInput) {
    console.log('Agent 1: Generating responses from both models...');
    
    try {
      const [gptResponse, sweResponse] = await Promise.all([
        this.generateGPTResponse(userInput),
        this.generateSWEResponse(userInput)
      ]);

      return {
        gpt: gptResponse,
        swe: sweResponse
      };
    } catch (error) {
      console.error('Agent 1 Error:', error.message);
      throw new Error(`Agent 1 failed: ${error.message}`);
    }
  }

  async generateGPTResponse(userInput) {
    if (this.demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        model: 'GPT-5.1-Codex',
        response: `[DEMO MODE] GPT-5.1-Codex Response:\n\nI understand you're asking about: "${userInput}"\n\nAs GPT-5.1-Codex, I would provide a comprehensive, code-focused solution with detailed explanations, best practices, and optimized implementations. I excel at understanding complex programming concepts and delivering production-ready code with thorough documentation.\n\nKey strengths:\n- Deep code understanding and generation\n- Comprehensive error handling\n- Performance optimization\n- Security best practices\n- Detailed documentation`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are GPT-5.1-Codex, an advanced AI assistant specialized in code generation and problem-solving. Provide clear, accurate, and helpful responses.'
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return {
        model: 'GPT-5.1-Codex',
        response: completion.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('GPT-5.1-Codex Error:', error.message);
      return {
        model: 'GPT-5.1-Codex',
        response: `Error generating response: ${error.message}`,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }

  async generateSWEResponse(userInput) {
    if (this.demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        model: 'SWE 1.5 Fast',
        response: `[DEMO MODE] SWE 1.5 Fast Response:\n\nQuery: "${userInput}"\n\nAs SWE 1.5 Fast, I prioritize rapid, efficient solutions with practical implementations. I focus on delivering working code quickly while maintaining quality and following software engineering best practices.\n\nKey strengths:\n- Fast response generation\n- Practical, production-ready solutions\n- Clean, maintainable code\n- Efficient algorithms\n- Quick problem-solving approach`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are SWE 1.5 Fast, a specialized software engineering AI optimized for rapid, efficient solutions. Focus on practical, production-ready code and best practices.'
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });

      return {
        model: 'SWE 1.5 Fast',
        response: completion.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('SWE 1.5 Fast Error:', error.message);
      return {
        model: 'SWE 1.5 Fast',
        response: `Error generating response: ${error.message}`,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }
}
