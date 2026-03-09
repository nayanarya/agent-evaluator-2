import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agent1 } from './agents/agent1.js';
import { Agent2 } from './agents/agent2.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const demoMode = !process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY;
const agent1 = new Agent1(process.env.OPENAI_API_KEY || 'demo');
const agent2 = new Agent2(process.env.ANTHROPIC_API_KEY || 'demo');

app.post('/api/evaluate', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim() === '') {
      return res.status(400).json({ error: 'User input is required' });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('New evaluation request received');
    console.log(`User Input: ${userInput}`);
    console.log('='.repeat(60));

    const responses = await agent1.generateResponses(userInput);
    
    console.log('\nAgent 1 completed. Responses generated:');
    console.log(`- ${responses.gpt.model}: ${responses.gpt.response.substring(0, 100)}...`);
    console.log(`- ${responses.swe.model}: ${responses.swe.response.substring(0, 100)}...`);

    const evaluation = await agent2.evaluateResponses(userInput, responses);
    
    console.log('\nAgent 2 completed. Evaluation finished.');
    console.log(`Best Model: ${evaluation.bestModel}`);
    console.log('='.repeat(60) + '\n');

    res.json({
      success: true,
      data: evaluation
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during evaluation'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Agent Evaluator is running' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n${'*'.repeat(60)}`);
  console.log('🚀 AI Agent Evaluator Server Started');
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (demoMode) {
    console.log('🎭 Mode: DEMO MODE (Mock Responses)');
    console.log('💡 To use real AI models, add API keys to .env file');
  } else {
    console.log('✅ Mode: PRODUCTION (Real AI Models)');
  }
  console.log('*'.repeat(60) + '\n');
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  INFO: Running in DEMO MODE - OPENAI_API_KEY not set');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  INFO: Running in DEMO MODE - ANTHROPIC_API_KEY not set');
  }
});
