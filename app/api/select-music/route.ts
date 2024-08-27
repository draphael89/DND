import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';

const musicTracks = [
  { name: "Acceptance.mp3", description: "Calm and reflective, suitable for moments of personal growth or overcoming challenges" },
  { name: "Appreciation v1.mp3", description: "Uplifting and grateful, perfect for positive interactions or discoveries" },
  { name: "Authority.mp3", description: "Powerful and commanding, ideal for encounters with important figures or making crucial decisions" },
  { name: "Beauty v1.mp3", description: "Serene and enchanting, great for exploring beautiful landscapes or peaceful moments" },
  { name: "Belief.mp3", description: "Inspiring and spiritual, suitable for moments of faith or conviction" },
  { name: "Charity.mp3", description: "Warm and compassionate, perfect for acts of kindness or helping others" },
  { name: "Confidence.mp3", description: "Bold and self-assured, ideal for moments of triumph or facing challenges" },
  { name: "Courage.mp3", description: "Heroic and determined, great for confronting dangers or taking risks" },
  { name: "Curiosity.mp3", description: "Playful and inquisitive, suitable for exploration or discovery" },
  { name: "Dealing With Change v1.mp3", description: "Contemplative and adaptive, ideal for moments of transition or unexpected events" },
  { name: "Death v1.mp3", description: "Somber and reflective, appropriate for loss or endings" },
  { name: "Deception v1.mp3", description: "Mysterious and tense, perfect for moments of betrayal or uncovering lies" },
  { name: "Desire v1.mp3", description: "Passionate and yearning, suitable for romantic encounters or pursuing goals" },
  { name: "Dreams.mp3", description: "Ethereal and surreal, ideal for fantastical elements or visions" },
  { name: "Duality v1.mp3", description: "Complex and contrasting, great for moral dilemmas or conflicting emotions" },
  { name: "Education.mp3", description: "Thoughtful and enlightening, suitable for learning new skills or gaining knowledge" },
  { name: "Ego.mp3", description: "Confident and sometimes arrogant, ideal for encounters with proud characters or personal achievements" },
  { name: "Emotion.mp3", description: "Intense and varied, perfect for highly emotional scenes or revelations" },
  { name: "Endurance.mp3", description: "Steady and persistent, great for long journeys or overcoming obstacles" },
  { name: "Enjoy the Moment.mp3", description: "Light-hearted and present, suitable for celebrations or peaceful interludes" },
  { name: "Enlightenment.mp3", description: "Profound and transformative, ideal for moments of great realization or spiritual awakening" },
  { name: "Experience v1.mp3", description: "Rich and varied, perfect for reflecting on past events or gaining wisdom" },
  { name: "Expression.mp3", description: "Creative and emotive, suitable for artistic endeavors or self-discovery" },
  { name: "Failure.mp3", description: "Melancholic yet hopeful, ideal for setbacks or learning from mistakes" },
  { name: "Faith.mp3", description: "Devout and reassuring, great for religious themes or unwavering belief" },
  { name: "Fate.mp3", description: "Mysterious and inevitable, suitable for pivotal moments or destined encounters" },
  { name: "Fear.mp3", description: "Tense and unsettling, perfect for horror elements or facing phobias" },
  { name: "Free Will.mp3", description: "Liberating and empowering, ideal for making important choices or breaking free from constraints" },
  { name: "Gratitude.mp3", description: "Warm and appreciative, suitable for moments of thankfulness or recognition" },
  { name: "Greed.mp3", description: "Dark and consuming, perfect for encounters with avaricious characters or temptations" },
  { name: "Growth.mp3", description: "Gradual and uplifting, great for character development or overcoming personal limitations" },
  { name: "Happiness v1.mp3", description: "Joyful and exuberant, ideal for celebrations or moments of pure bliss" },
  { name: "Hope v1.mp3", description: "Optimistic and inspiring, suitable for overcoming adversity or new beginnings" },
  { name: "Human Nature.mp3", description: "Complex and introspective, perfect for exploring character motivations or societal themes" },
  { name: "Illusion.mp3", description: "Deceptive and dreamlike, ideal for encounters with illusions or questioning reality" },
  { name: "Imagination.mp3", description: "Whimsical and creative, great for brainstorming or fantastical scenarios" },
  { name: "Individuality.mp3", description: "Unique and assertive, suitable for moments of self-expression or standing out" },
  { name: "Infinite.mp3", description: "Vast and awe-inspiring, perfect for cosmic themes or contemplating eternity" },
  { name: "Kindness.mp3", description: "Gentle and compassionate, ideal for acts of generosity or forming friendships" },
  { name: "Life v1.mp3", description: "Vibrant and dynamic, suitable for birth, renewal, or celebrating existence" },
  { name: "Madness.mp3", description: "Chaotic and unsettling, great for descents into insanity or surreal experiences" },
  { name: "Meaning.mp3", description: "Profound and contemplative, ideal for philosophical discussions or finding purpose" },
  { name: "Memory.mp3", description: "Nostalgic and reflective, perfect for flashbacks or reminiscing" },
  { name: "Morality.mp3", description: "Thoughtful and conflicted, suitable for ethical dilemmas or moral choices" },
  { name: "Motivation v1.mp3", description: "Energetic and inspiring, great for rallying allies or pursuing goals" },
  { name: "Mystery v1.mp3", description: "Intriguing and suspenseful, ideal for uncovering secrets or solving puzzles" },
  { name: "Perception v1.mp3", description: "Insightful and revealing, perfect for moments of realization or changing perspectives" },
  { name: "Perseverance.mp3", description: "Determined and unyielding, suitable for overcoming great obstacles or long struggles" },
  { name: "Politics v1.mp3", description: "Complex and strategic, ideal for political intrigue or power struggles" },
  { name: "Positive Thinking.mp3", description: "Upbeat and optimistic, great for overcoming negativity or finding silver linings" },
  { name: "Purpose.mp3", description: "Driven and meaningful, suitable for defining goals or finding one's calling" },
  { name: "Responsibility.mp3", description: "Serious and dutiful, ideal for taking on important tasks or leadership roles" },
  { name: "Science v1.mp3", description: "Analytical and curious, perfect for scientific discoveries or technological themes" },
  { name: "Self-Development.mp3", description: "Progressive and empowering, great for personal growth or skill improvement" },
  { name: "Simplicity.mp3", description: "Minimalist and clear, suitable for moments of clarity or returning to basics" },
  { name: "Suffering.mp3", description: "Sorrowful and empathetic, ideal for tragic events or enduring hardships" },
  { name: "The Future v1.mp3", description: "Forward-looking and uncertain, perfect for visions of the future or making plans" },
  { name: "The Journey v1.mp3", description: "Adventurous and progressive, suitable for travel montages or personal quests" },
  { name: "The Mind.mp3", description: "Introspective and complex, ideal for psychological themes or inner conflicts" },
  { name: "The Nature of Reality.mp3", description: "Philosophical and mind-bending, great for questioning existence or alternate realities" },
  { name: "The Past.mp3", description: "Nostalgic and sometimes melancholic, perfect for exploring history or past regrets" },
  { name: "The Unknown.mp3", description: "Mysterious and anticipatory, suitable for facing uncertainties or new frontiers" },
  { name: "Time.mp3", description: "Rhythmic and inevitable, ideal for themes of aging, change, or the passage of time" },
  { name: "Truth.mp3", description: "Revealing and sometimes harsh, great for moments of honesty or uncovering facts" },
  { name: "Vulnerability.mp3", description: "Delicate and emotional, perfect for moments of openness or facing fears" },
  { name: "Wisdom v1.mp3", description: "Sage-like and insightful, suitable for imparting knowledge or making wise decisions" },
  { name: "Work v1.mp3", description: "Industrious and focused, ideal for montages of effort or achieving through labor" },
  { name: "Writing.mp3", description: "Creative and expressive, great for storytelling or artistic pursuits" }
];

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 });
  }

  if (!openai) {
    return NextResponse.json({ error: 'OpenAI client is not initialized' }, { status: 500 });
  }

  try {
    const { scene } = await request.json();

    const systemPrompt = `You are an expert at selecting background music for role-playing games. Your task is to choose the most appropriate music track based on the current scene description. Consider the mood, themes, and actions described in the scene.`;

    const userPrompt = `Given the following scene, select the most appropriate background music from the available tracks. Consider how the music's theme and mood align with the scene's content and atmosphere.

    Scene: ${scene}

    Available tracks:
    ${musicTracks.map(track => `- ${track.name}: ${track.description}`).join('\n')}

    Respond with only the filename of the chosen track.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const selectedMusic = response.choices[0].message.content?.trim() ?? "Beauty v1.mp3";

    return NextResponse.json({ selectedMusic });
  } catch (error: any) {
    console.error('Error selecting music:', error);
    return NextResponse.json({ error: 'An error occurred while selecting music.' }, { status: 500 });
  }
}