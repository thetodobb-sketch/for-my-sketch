'use client';

import { useState, useRef } from 'react';
import { generateStencil, imageToBase64 } from '@/lib/imageProcessing';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [stencilImage, setStencilImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, sube una imagen válida');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const base64 = await imageToBase64(file);
      setOriginalImage(base64);

      // Generar stencil
      const stencil = await generateStencil(base64);
      setStencilImage(stencil);
    } catch (err) {
      setError('Error procesando la imagen. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setStencilImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ForMySketch</h1>
            <p className="text-sm text-slate-400">Tu boceto → Realista + Stencil</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!originalImage ? (
          // Upload area
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-blue-400 bg-blue-400/10'
                : 'border-slate-500 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="text-5xl">📸</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Sube tu boceto</h2>
                <p className="text-slate-400">
                  Arrastra tu imagen aquí o haz clic para seleccionar
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Soporta JPG, PNG, WebP • Máx. 10 MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
            <p className="text-xl font-semibold">Procesando tu boceto...</p>
            <p className="text-slate-400 text-sm">
              Generando versión realista y stencil
            </p>
          </div>
        ) : (
          // Results
          <div className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original/Realistic */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Versión Realista</h3>
                <div className="bg-slate-800 rounded-xl overflow-hidden aspect-square">
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Realistic"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <button
                  onClick={() => downloadImage(originalImage!, 'boceto-realista.png')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Descargar Realista
                </button>
              </div>

              {/* Stencil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Stencil para Marcar</h3>
                <div className="bg-slate-800 rounded-xl overflow-hidden aspect-square">
                  {stencilImage && (
                    <img
                      src={stencilImage}
                      alt="Stencil"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <button
                  onClick={() => downloadImage(stencilImage!, 'stencil-tatuaje.png')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Descargar Stencil
                </button>
              </div>
            </div>

            {/* Reset button */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Procesar Otro Boceto
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-16 py-6 text-center text-slate-400 text-sm">
        <p>ForMySketch • Herramienta para estudios de tatuaje</p>
      </div>
    </main>
  );
}
