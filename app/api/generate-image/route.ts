import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/openai';
import { rateLimiter } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  // Apply rate limiting
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimitResult = await rateLimiter.limit(identifier);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { prompt, size = "1024x1024" } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const imageUrl = await generateImage(prompt, size as '256x256' | '512x512' | '1024x1024');
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
