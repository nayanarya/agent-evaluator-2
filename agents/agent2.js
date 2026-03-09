import Anthropic from '@anthropic-ai/sdk';

export class Agent2 {
  constructor(apiKey) {
    this.demoMode = !apiKey || apiKey === 'demo';
    if (!this.demoMode) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  async evaluateResponses(userInput, responses) {
    console.log('Agent 2: Evaluating responses using Claude Sonnet 4.5...');
    
    if (this.demoMode) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const evaluationText = `[DEMO MODE] Evaluation by Claude Sonnet 4.5:\n\nAfter carefully analyzing both responses to the query "${userInput}", I have evaluated them across multiple dimensions:\n\n**GPT-5.1-Codex Analysis:**\n- Provides comprehensive, detailed explanations\n- Strong focus on code quality and best practices\n- Excellent documentation and error handling\n- More thorough but potentially slower\n\n**SWE 1.5 Fast Analysis:**\n- Delivers rapid, efficient solutions\n- Practical and production-ready approach\n- Clean, maintainable code structure\n- Optimized for speed without sacrificing quality\n\n**Conclusion:**\nBoth models demonstrate strong capabilities. GPT-5.1-Codex excels in comprehensive analysis and detailed implementations, while SWE 1.5 Fast prioritizes rapid delivery with practical solutions. For this particular query, GPT-5.1-Codex provides a more thorough and complete response with better documentation and edge case handling.\n\nBEST MODEL: GPT-5.1-Codex`;
      
      return {
        evaluation: evaluationText,
        bestModel: 'GPT-5.1-Codex',
        responses: responses,
        evaluatedBy: 'Claude Sonnet 4.5 (Demo Mode)',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const evaluationPrompt = this.buildEvaluationPrompt(userInput, responses);
      
      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: evaluationPrompt
          }
        ]
      });

      const evaluationText = message.content[0].text;
      const bestModel = this.extractBestModel(evaluationText);

      return {
        evaluation: evaluationText,
        bestModel: bestModel,
        responses: responses,
        evaluatedBy: 'Claude Sonnet 4.5',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Agent 2 Error:', error.message);
      throw new Error(`Agent 2 evaluation failed: ${error.message}`);
    }
  }

  buildEvaluationPrompt(userInput, responses) {
    return `You are an expert AI evaluator. Compare the following two responses to the user's input and determine which one is better.

USER INPUT:
${userInput}

RESPONSE 1 (${responses.gpt.model}):
${responses.gpt.response}

RESPONSE 2 (${responses.swe.model}):
${responses.swe.response}

Please evaluate both responses based on:
1. Accuracy and correctness
2. Completeness and thoroughness
3. Clarity and readability
4. Practical applicability
5. Code quality (if applicable)

Provide a detailed analysis and conclude with a clear statement of which model performed better.
End your evaluation with exactly one of these lines:
"BEST MODEL: GPT-5.1-Codex"
OR
"BEST MODEL: SWE 1.5 Fast"`;
  }

  extractBestModel(evaluationText) {
    const gptMatch = evaluationText.match(/BEST MODEL:\s*GPT-5\.1-Codex/i);
    const sweMatch = evaluationText.match(/BEST MODEL:\s*SWE 1\.5 Fast/i);
    
    if (gptMatch) {
      return 'GPT-5.1-Codex';
    } else if (sweMatch) {
      return 'SWE 1.5 Fast';
    }
    
    if (evaluationText.toLowerCase().includes('gpt') && 
        (evaluationText.toLowerCase().includes('better') || 
         evaluationText.toLowerCase().includes('superior') ||
         evaluationText.toLowerCase().includes('winner'))) {
      return 'GPT-5.1-Codex';
    } else if (evaluationText.toLowerCase().includes('swe') && 
               (evaluationText.toLowerCase().includes('better') || 
                evaluationText.toLowerCase().includes('superior') ||
                evaluationText.toLowerCase().includes('winner'))) {
      return 'SWE 1.5 Fast';
    }
    
    return 'Tie - Both models performed equally well';
  }
}
