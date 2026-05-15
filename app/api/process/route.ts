import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROMPT = `Transform this tattoo sketch into a photorealistic black and grey tattoo render, as if it were a professionally finished tattoo photographed on skin.

Strict requirements:
- Preserve EXACT composition, proportions, line placement, and every design element from the original sketch.
- Render in black and grey only (no color), with rich blacks, soft greys, and clean white highlights.
- Add realistic shading, depth, and texture appropriate to a high-end black-and-grey tattoo.
- Keep the image clean and centered on a neutral background (light skin tone or off-white).
- Do NOT add elements not present in the sketch. Do NOT change the design.

Output: a single photorealistic image only.`;

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            { text: PROMPT },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
      config: { responseModalities: [Modality.IMAGE] },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      const textPart = parts.find((p) => p.text)?.text;
      return NextResponse.json(
        { error: 'No image returned', detail: textPart ?? 'unknown' },
        { status: 502 },
      );
    }

    const outMime = imagePart.inlineData.mimeType ?? 'image/png';
    const dataUrl = `data:${outMime};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ image: dataUrl });
  } catch (error) {
    console.error('Error generating realistic image:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Generation failed', detail: message }, { status: 500 });
  }
}
