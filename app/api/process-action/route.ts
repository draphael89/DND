import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';

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
  try {
    const { character, action, currentScene, rollResult } = await request.json() as ActionRequest & { rollResult: number };

    const systemPrompt = `You are an expert Dungeon Master, skilled in creating engaging and dynamic scenes based on player actions. Your responses should be vivid, atmospheric, and move the story forward.`;

    const userPrompt = `
    Current scene: ${currentScene}
    
    Character: ${character.race} ${character.class} with a ${character.background} background.
    Highest ability: ${Object.entries(character.abilities).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
    
    Player action: ${action}
    Dice roll result: ${rollResult}
    
    Based on the current scene, the character's action, and the dice roll result, create a new scene that:
    1. Describes the outcome of the action in 2-3 sentences, considering the roll result (1-5: critical failure, 6-10: failure, 11-15: partial success, 16-19: success, 20: critical success).
    2. Sets up a new situation or challenge in 2-3 sentences.
    3. Hints at possible next actions or decisions the player might take.
    4. Is written in second-person perspective, addressing the player directly.
    
    The total response should be 4-6 sentences long.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Changed to gpt-4o-mini for faster processing
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150, // Reduced for faster response
      temperature: 0.7,
    });

    const newScene = response.choices[0].message.content ?? "An error occurred while generating the scene.";

    return NextResponse.json({ newScene, rollResult });
  } catch (error: any) {
    console.error('Error processing action:', error);
    return NextResponse.json({ error: 'An error occurred while processing your action.' }, { status: 500 });
  }
}