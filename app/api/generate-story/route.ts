import { NextResponse } from 'next/server';
import { generateStory } from '@/lib/openai';
import { rateLimiter } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  // Apply rate limiting
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimitResult = await rateLimiter.limit(identifier);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { character, currentState, action } = await request.json();

  if (!character || !currentState || !action) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const story = await generateStory(character, currentState, action);
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
