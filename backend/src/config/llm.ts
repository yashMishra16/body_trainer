import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

export function getGroqModel(modelName = 'llama3-70b-8192') {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }

  return new ChatGroq({
    model: modelName,
    temperature: 0.7,
    maxTokens: 4096,
    apiKey: process.env.GROQ_API_KEY,
  });
}

export function getLLM() {
  if (process.env.GROQ_API_KEY) {
    return getGroqModel();
  }
  throw new Error('GROQ_API_KEY environment variable is required');
}
