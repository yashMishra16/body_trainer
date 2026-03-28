import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

export function getAnthropicModel(modelName = 'claude-3-5-sonnet-20241022') {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  return new ChatAnthropic({
    model: modelName,
    temperature: 0.7,
    maxTokens: 4096,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export function getOpenAIModel(modelName = 'gpt-4o') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return new ChatOpenAI({
    model: modelName,
    temperature: 0.7,
    maxTokens: 4096,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

export function getLLM() {
  if (process.env.ANTHROPIC_API_KEY) {
    return getAnthropicModel();
  }
  if (process.env.OPENAI_API_KEY) {
    return getOpenAIModel();
  }
  throw new Error('At least one LLM API key (ANTHROPIC_API_KEY or OPENAI_API_KEY) is required');
}
