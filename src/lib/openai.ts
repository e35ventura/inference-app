import OpenAI from 'openai';

export const MODELS = {
  GPT4: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
  CODER: "deepseek-ai/deepseek-coder-33b-instruct",
  LLAMA: "NousResearch/Meta-Llama-3.1-8B-Instruct",
  HERMES: "NousResearch/Hermes-3-Llama-3.1-8B",
  NEMOTRON: "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
} as const;

export const MODEL_INFO = {
  GPT4: {
    name: "DeepSeek R1 70B",
    description: "A powerful large language model for general-purpose tasks, creative writing, and complex problem-solving."
  },
  CODER: {
    name: "DeepSeek Coder 33B",
    description: "Specialized model for code generation, technical documentation, and software development assistance."
  },
  LLAMA: {
    name: "Meta-Llama 3.1 8B",
    description: "Efficient and capable model for general tasks, optimized for fast responses and lower resource usage."
  },
  HERMES: {
    name: "Hermes-3 8B",
    description: "Fine-tuned version of Llama 3.1 optimized for instruction following and conversational tasks."
  },
  NEMOTRON: {
    name: "Nemotron 70B",
    description: "NVIDIA's powerful instruction-tuned model based on Llama 3.1, optimized for advanced reasoning and complex tasks."
  }
} as const;

export type ModelType = keyof typeof MODELS;

export const client = new OpenAI({
  baseURL: 'https://api.targon.com/v1',
  apiKey: 'sn4_rup3buup816l74pl76z30je8ifb6',
  dangerouslyAllowBrowser: true
});

export async function* streamCompletion(message: string, model: ModelType) {
  const response = await client.chat.completions.create({
    model: MODELS[model],
    stream: true,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message },
    ],
  });

  for await (const chunk of response) {
    if (chunk.choices[0].delta.content) {
      yield chunk.choices[0].delta.content;
    }
  }
}