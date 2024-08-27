import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';

interface ActionGenerationRequest {
  character: {
    race: string;
    class: string;
    background: string;
    abilities: Record<string, number>;
  };
  currentScene: string;
  gameState: any; // Add more specific game state properties as needed
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 });
  }

  if (!openai) {
    return NextResponse.json({ error: 'OpenAI client is not initialized' }, { status: 500 });
  }

  try {
    const { character, currentScene, gameState } = await request.json() as ActionGenerationRequest;

    const systemPrompt = `You are an AI assistant for a D&D-style game, tasked with generating contextually appropriate actions for the player. Consider the character's race, class, background, abilities, the current scene, and game state when suggesting actions.`;

    const userPrompt = `
    Current scene: ${currentScene}
    
    Character: 
    - Race: ${character.race}
    - Class: ${character.class}
    - Background: ${character.background}
    - Abilities: ${JSON.stringify(character.abilities)}
    
    Game State: ${JSON.stringify(gameState)}
    
    Based on this information, generate 4 possible actions the player could take. Each action should be relevant to the current situation and utilize the character's unique traits. Format the response as a JSON array of strings, without any additional formatting or explanation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    let actions: string[];
    try {
      actions = JSON.parse(content);
      if (!Array.isArray(actions)) {
        throw new Error('Parsed content is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback: extract actions from the content string
      actions = content.split('\n').filter(line => line.trim().startsWith('"') && line.trim().endsWith('"'))
        .map(line => line.trim().replace(/^"|"$/g, ''));
      if (actions.length === 0) {
        throw new Error('Failed to parse actions from OpenAI response');
      }
    }

    return NextResponse.json({ actions });
  } catch (error: any) {
    console.error('Error generating actions:', error);
    return NextResponse.json({ error: 'An error occurred while generating actions.' }, { status: 500 });
  }
}