import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';
import { processEffects } from '../../../lib/gameLogic';

interface ActionRequest {
  character: {
    race: string;
    class: string;
    background: string;
    abilities: Record<string, number>;
  };
  action: string;
  currentScene: string;
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 });
  }

  if (!openai) {
    return NextResponse.json({ error: 'OpenAI client is not initialized' }, { status: 500 });
  }

  try {
    const { action, currentScene, character, sceneHistory } = await request.json();

    const systemPrompt = `You are an expert Dungeon Master, creating dynamic and branching narratives based on player actions and history.`;

    const userPrompt = `
    Current scene: ${currentScene}
    Player action: ${action}
    Character: ${JSON.stringify(character)}
    Scene history: ${JSON.stringify(sceneHistory)}

    Create a new scene that:
    1. Resolves the player's action
    2. Describes the outcome and any changes to the environment
    3. Sets up new challenges or opportunities
    4. Suggests possible next actions

    Also, provide a list of effects on the character in the following format:
    EFFECTS:
    - hp: +10
    - mp: -5
    - xp: +20
    - inventory: +Health Potion, -Gold Coin
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to generate content');
    }

    let newScene = content;
    let effects: { characterUpdates: Record<string, number>; inventoryChanges: string[] };

    const effectsIndex = content.indexOf('EFFECTS:');
    if (effectsIndex !== -1) {
      newScene = content.substring(0, effectsIndex).trim();
      const effectsString = content.substring(effectsIndex + 8).trim();
      effects = processEffects(effectsString);
    } else {
      console.warn('No EFFECTS section found in the generated content');
      effects = { characterUpdates: {}, inventoryChanges: [] };
    }

    return NextResponse.json({ 
      newScene, 
      characterUpdates: effects.characterUpdates,
      inventoryChanges: effects.inventoryChanges,
    });
  } catch (error: any) {
    console.error('Error processing action:', error);
    return NextResponse.json({ error: 'An error occurred while processing your action.' }, { status: 500 });
  }
}