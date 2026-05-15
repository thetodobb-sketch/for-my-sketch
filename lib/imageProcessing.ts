// Genera stencil en blanco y negro desde una imagen
export async function generateStencil(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar imagen en escala de grises
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0);

      // Obtener datos de píxeles
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Aplicar threshold para crear efecto stencil (solo blanco y negro)
      const threshold = 128;
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = gray > threshold ? 255 : 0;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        // data[i + 3] es alpha, se deja igual
      }

      ctx.putImageData(imageData, 0, 0);

      // Aplicar filtro de bordes (Sobel-like) para resaltar contornos
      const edgeImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const edgeData = edgeImageData.data;

      const originalData = new Uint8ClampedArray(edgeData);

      for (let i = 0; i < canvas.width * canvas.height; i++) {
        const row = Math.floor(i / canvas.width);
        const col = i % canvas.width;

        if (row === 0 || row === canvas.height - 1 || col === 0 || col === canvas.width - 1) {
          continue;
        }

        const gx =
          -1 * originalData[(i - canvas.width - 1) * 4] +
          1 * originalData[(i - canvas.width + 1) * 4] +
          -2 * originalData[(i - 1) * 4] +
          2 * originalData[(i + 1) * 4] +
          -1 * originalData[(i + canvas.width - 1) * 4] +
          1 * originalData[(i + canvas.width + 1) * 4];

        const gy =
          -1 * originalData[(i - canvas.width - 1) * 4] +
          -2 * originalData[(i - canvas.width) * 4] +
          -1 * originalData[(i - canvas.width + 1) * 4] +
          1 * originalData[(i + canvas.width - 1) * 4] +
          2 * originalData[(i + canvas.width) * 4] +
          1 * originalData[(i + canvas.width + 1) * 4];

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const edgeValue = magnitude > 100 ? 0 : 255;

        edgeData[i * 4] = edgeValue;
        edgeData[i * 4 + 1] = edgeValue;
        edgeData[i * 4 + 2] = edgeValue;
      }

      ctx.putImageData(edgeImageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Error loading image'));
    img.src = imageSrc;
  });
}

// Convierte imagen a Base64
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
