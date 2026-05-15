# Friends of Sketch 🎨

Herramienta online para procesar bocetos de tatuaje y generar versiones realistas + stencils para marcar.

## Características

- ✅ **Upload de bocetos** - Drag-drop de imágenes
- ✅ **Versión realista** - Mejora el boceto a estilo fotográfico B&N
- ✅ **Stencil automático** - Contornos limpios para transferir a piel
- ✅ **Optimizado para iPad** - Interfaz touch-friendly
- ✅ **Sin instalación** - Todo en la nube, acceso inmediato

## Stack

- **Frontend**: Next.js 15 + Tailwind CSS
- **Hosting**: Vercel (deploy con 1 click)
- **Backend**: Node.js API routes
- **IA**: Claude API (análisis) + Canvas API (stencil)

## Configuración Local

### Requisitos
- Node.js 18+
- npm o yarn

### Setup

\`\`\`bash
cd for-my-sketch
npm install
\`\`\`

### Variables de entorno

Crea \`.env.local\`:
\`\`\`
ANTHROPIC_API_KEY=tu_api_key_aqui
\`\`\`

Obtén tu API key en [console.anthropic.com](https://console.anthropic.com)

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000)

## Deploy a Vercel

### Opción 1: Vercel CLI (recomendado)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Sigue los pasos y autoriza en vercel.com. En el dashboard:
1. Ve a Settings → Environment Variables
2. Agrega \`ANTHROPIC_API_KEY\`
3. Redeploy

### Opción 2: GitHub + Vercel

1. Crea repo en GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repo
4. Agrega variables de entorno
5. Deploy automático

## Funcionalidades (MVP actual)

✅ Upload de imágenes  
✅ Procesamiento local (rápido, sin latencia)  
✅ Generación de stencil en Canvas  
✅ Descargas directas  
✅ Interfaz iPad-optimizada  

## Próximas mejoras

🔄 Integración con Replicate para imagen fotorrealista generada con IA  
📱 Historial de trabajos guardados  
🎯 Ajustes de contraste/brillo en tiempo real  
👥 Múltiples usuarios por estudio  

## Notas

- Las imágenes se procesan en el cliente (navegador), no se envían a servidor
- Solo se envía a Claude API cuando actives análisis avanzado (próxima feature)
- Compatible con iOS Safari, Chrome, Edge
- Recomendado: iPad Air o superior para mejor experiencia

## Licencia

Privado - Para uso interno en estudio de tatuaje
