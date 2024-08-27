import { NextResponse } from 'next/server';
import { generateStory } from '@/lib/openai';

export async function POST(request: Request) {
  const { race, characterClass, background, abilities } = await request.json();

  console.log('API Route: Current working directory:', process.cwd());
  console.log('API Route: NODE_ENV:', process.env.NODE_ENV);
  console.log('API Route: OPENAI_API_KEY defined:', !!process.env.OPENAI_API_KEY);
  if (process.env.OPENAI_API_KEY) {
    console.log('API Route: API Key length:', process.env.OPENAI_API_KEY.length);
    console.log('API Route: API Key first 7 chars:', process.env.OPENAI_API_KEY.substring(0, 7));
  }

  try {
    // Generate new backstory
    const backstory = await generateStory(race, characterClass, background, abilities);
    
    return NextResponse.json({ backstory });
  } catch (error) {
    console.error('Error generating backstory:', error);
    return NextResponse.json({ error: 'Failed to generate backstory' }, { status: 500 });
  }
}