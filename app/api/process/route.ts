import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STYLE_SUFFIX =
  ', photorealistic black and grey tattoo render, professional tattoo photography on skin, rich blacks, soft greys, clean white highlights, neutral background, highly detailed, sharp focus, no color';

const DESCRIBE_PROMPT = `You are helping render a tattoo sketch as a photorealistic tattoo.

Describe this tattoo sketch as a single concrete paragraph for a text-to-image model. Include:
- Main subject and any sub-elements
- Composition and arrangement (centered, full body, portrait, etc.)
- Distinguishing visual details (linework style, shading, ornaments, text)
- Approximate proportions

Be concrete, no opinions, no preamble. Max 80 words. Output only the description.`;

type SupportedMime = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
const SUPPORTED: ReadonlySet<string> = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export async function POST(request: NextRequest) {
  try {
    const { image } = (await request.json()) as { image?: string };
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid image data URL' }, { status: 400 });
    }
    const [, mimeType, base64Data] = match;
    if (!SUPPORTED.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mimeType}` },
        { status: 400 },
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 },
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const visionResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as SupportedMime,
                data: base64Data,
              },
            },
            { type: 'text', text: DESCRIBE_PROMPT },
          ],
        },
      ],
    });

    const descBlock = visionResponse.content.find((b) => b.type === 'text');
    if (!descBlock || descBlock.type !== 'text') {
      return NextResponse.json({ error: 'Failed to describe sketch' }, { status: 502 });
    }
    const description = descBlock.text.trim();

    const fullPrompt = `${description}${STYLE_SUFFIX}`;
    const seed = Math.floor(Math.random() * 1_000_000);
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}` +
      `?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      const detail = await imgRes.text().catch(() => imgRes.statusText);
      return NextResponse.json(
        { error: 'Pollinations generation failed', detail },
        { status: 502 },
      );
    }
    const arrayBuffer = await imgRes.arrayBuffer();
    const outBase64 = Buffer.from(arrayBuffer).toString('base64');
    const outMime = imgRes.headers.get('content-type') ?? 'image/jpeg';

    return NextResponse.json({
      image: `data:${outMime};base64,${outBase64}`,
      description,
    });
  } catch (error) {
    console.error('Error generating realistic image:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Generation failed', detail: message },
      { status: 500 },
    );
  }
}
