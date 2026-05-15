import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeSketch(base64Image: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
            },
          },
          {
            type: 'text',
            text: `Analiza este boceto de tatuaje y proporciona una descripción detallada que permita generar una versión fotorrealista en blanco y negro.

Describe:
1. Elementos principales (formas, figuras, objetos)
2. Detalles y texturas visibles
3. Proporciones y composición
4. Estilo y características que deben preservarse
5. Sombreado y valores tonales que deberían mantenerse

La descripción debe ser clara y detallada para servir como base para generar una imagen fotorrealista de alta calidad.`,
          },
        ],
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  return textContent.text;
}
