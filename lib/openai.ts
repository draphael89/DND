import OpenAI from 'openai';

let openai: OpenAI | null = null;

if (typeof window === 'undefined') {
  // Server-side
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set in the environment variables');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}

export async function generateImage(prompt: string, size: '256x256' | '512x512' | '1024x1024' | '1024x1792' = '1024x1024') {
  if (!openai) {
    throw new Error('OpenAI client is not initialized');
  }
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `D&D style fantasy image: ${prompt}`,
      n: 1,
      size: size,
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    handleOpenAIError(error);
  }
}

export async function generateStory(race: string, characterClass: string, background: string, abilities: Record<string, number>) {
  if (!openai) {
    throw new Error('OpenAI client is not initialized');
  }
  const prompt = `Create a backstory for a ${race} ${characterClass} with a ${background} background. Their highest ability score is in ${Object.entries(abilities).reduce((a, b) => a[1] > b[1] ? a : b)[0]} and their lowest is in ${Object.entries(abilities).reduce((a, b) => a[1] < b[1] ? a : b)[0]}. The backstory should be about 150 words long and written in second person perspective.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating story:', error);
    handleOpenAIError(error);
  }
}

function handleOpenAIError(error: unknown): never {
  console.error('Detailed error:', error);
  if (error instanceof OpenAI.APIError) {
    console.error('OpenAI API Error:', error.status, error.message, error.code);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your environment variables.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
  }
  throw new Error('An unexpected error occurred while communicating with OpenAI.');
}

export default openai;