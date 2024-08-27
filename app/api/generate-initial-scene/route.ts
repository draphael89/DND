import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';
import { generateStory } from '@/lib/openai';

interface Character {
  race: string;
  class: string;
  background: string;
  abilities: Record<string, number>;
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 });
  }

  if (!openai) {
    return NextResponse.json({ error: 'OpenAI client is not initialized' }, { status: 500 });
  }

  try {
    const { character } = await request.json() as { character: Character };

    // Ensure character has all required properties
    if (!character || !character.race || !character.class || !character.background || !character.abilities) {
      console.error('Invalid character data:', character);
      throw new Error('Invalid character data');
    }

    const systemPrompt = `You are an expert Dungeon Master, crafting vivid, immersive opening scenes for role-playing games.`;

    const userPrompt = `Create a captivating 3-sentence opening scene for a ${character.race} ${character.class} with a ${character.background} background. Include:
1. The character's current situation
2. A subtle element of tension or mystery
3. The character's highest ability (${Object.entries(character.abilities).reduce((a, b) => a[1] > b[1] ? a : b)[0]})
Use second-person perspective.`;

    // Generate backstory and scene concurrently
    const [backstory, sceneResponse] = await Promise.all([
      generateStory(character.race, character.class, character.background, character.abilities),
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      })
    ]);

    const scene = sceneResponse.choices[0].message.content ?? "An error occurred while generating the scene.";

    const initialGameState = {
      character: character,
      inventory: [],
      quests: [],
      sceneHistory: [],
      currentScene: scene,
    };

    return NextResponse.json({ initialGameState });
  } catch (error: any) {
    console.error('Error generating initial scene:', error);
    return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 });
  }
}