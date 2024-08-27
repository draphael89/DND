import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in the environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt: string, size: '256x256' | '512x512' | '1024x1024' = '1024x1024') {
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
    throw new Error('Failed to generate image');
  }
}

export async function generateStory(character: any, currentState: string, action: string) {
  const prompt = `
    You are a Dungeon Master for a D&D game. Create a short, engaging narrative based on the following:
    Character: ${JSON.stringify(character)}
    Current game state: ${currentState}
    Player's action: ${action}

    Respond in the style of a D&D adventure, describing the outcome of the action and any new challenges or opportunities that arise.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story');
  }
}

export default openai;