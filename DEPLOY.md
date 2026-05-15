# 🚀 Guía de Deploy - Friends of Sketch

## ¿Cómo está estructurada la app?

```
📁 friends-of-sketch/
├── app/
│   ├── page.tsx          → Interfaz principal (UI)
│   └── api/process/      → Endpoint para procesar (próximamente)
├── lib/
│   ├── claude.ts         → Integración Claude API
│   ├── imageProcessing.ts→ Generación de stencils
├── .env.local            → Variables secretas (NO subir a Git)
└── vercel.json           → Config de Vercel
```

## ✅ Paso 1: Prepara tu API Key

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Inicia sesión (o crea cuenta)
3. Copia tu API key (ej: `sk-ant-abc123...`)
4. **IMPORTANTE**: NO compartir esta key públicamente

## ✅ Paso 2: Deploy a Vercel

### Opción A: CLI (si tienes terminal)

```bash
# Instala Vercel CLI (solo la primera vez)
npm install -g vercel

# Desde carpeta del proyecto
cd /Users/pablosilvame/Projects/friends-of-sketch
vercel

# Sigue las preguntas:
# - ¿Quieres continuar? → yes
# - ¿Qué proyecto es este? → Friends of Sketch
# - ¿Personalizado? → no
```

### Opción B: Dashboard Vercel (más fácil)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Conecta tu GitHub (si ya subiste el repo) O:
   - Descarga el ZIP de `/Users/pablosilvame/Projects/friends-of-sketch`
   - Sube manualmente en Vercel
4. En "Environment Variables" agrega:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Pega tu API key de Anthropic
5. Click "Deploy"

**Tu app estará en: `https://friends-of-sketch.vercel.app`** (o similar)

## ✅ Paso 3: Configura para iPad

1. Abre en iPad: `https://tu-url.vercel.app`
2. Agregalo a Home Screen:
   - Safari → Compartir → Agregar a Pantalla de Inicio
3. ¡Listo! Ya es una PWA (app-like)

## ✅ Paso 4: Usa en el estudio

- **Upload**: Fotografía boceto con iPad → drag & drop
- **Procesa**: Espera 2-3 segundos
- **Descarga**: 2 imágenes listas
  - Realista (para referencia)
  - Stencil (para marcar)

## 🔐 Seguridad (IMPORTANTE)

✅ **DO** - Estos están seguros:
- API keys en `.env` local (no en git)
- API keys en Vercel Environment Variables
- URLs públicas del sitio

❌ **DON'T** - Estos exponen tu API:
- Pegar API key en `.env.local` y subir a GitHub
- Compartir tu API key por Slack/email
- Poner API keys en código público

## 🆘 Troubleshooting

### "Error: API key not found"
→ Verifica que `ANTHROPIC_API_KEY` esté en Vercel Environment Variables

### "Error procesando imagen"
→ Intenta con una imagen diferente (JPG, PNG, WebP)

### "Muy lento en iPad"
→ Normal (2-3s). Si es más lento, verifica conexión WiFi

### "Botones no responden"
→ Actualiza el navegador (pull to refresh)

## 📊 Monitoreo

En [vercel.com/dashboard](https://vercel.com/dashboard) puedes ver:
- Hits/mes (tráfico)
- Errores (si hay)
- Logs en vivo
- Analytics

## 🔄 Actualizaciones futuras

Para agregar nuevas features:

```bash
# 1. Edita código localmente
# 2. Commit a Git
git add -A
git commit -m "Feature: xyz"

# 3. Si está en GitHub, Vercel auto-deploya
# Si no, vuelve a hacer: vercel --prod
```

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs en Vercel dashboard
2. Verifica API key en `.env.local`
3. Prueba en otra imagen
4. Limpia cache del navegador (Settings → Clear History)

---

**¡Listo!** Tu app está en la nube. 🎉
