# MINDTRACE — Laboratorio criminológico

Aplicación educativa responsive para estudiantes de pregrado. Incluye cuatro casos de simulación, entrevistas con decisiones ramificadas, niveles desde Difícil hasta Experto, una escena 3D explorable y conexión opcional a Supabase.

## Requisitos
- Node.js 20 o superior
- Proyecto Supabase
- Cuenta Vercel (opcional para despliegue)

## Ejecutar en local
1. Descomprime el ZIP y abre una terminal en la carpeta `mindtrace`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia `.env.example` como `.env.local`.
4. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores de **Project Settings → API** de Supabase. Usa solo la clave pública anon/publishable; nunca una `service_role`.
5. Ejecuta:
   ```bash
   npm run dev
   ```
6. Para validar producción:
   ```bash
   npm run build
   npm run preview
   ```

Sin variables de Supabase, el prototipo sigue funcionando en modo local y muestra el estado de conexión. Las partidas locales no se sincronizan entre dispositivos.

## Configurar Supabase
1. En Supabase, abre **SQL Editor → New query**.
2. Copia y ejecuta el contenido de `supabase/schema.sql`.
3. En Vercel, entra en el proyecto → **Settings → Environment Variables**.
4. Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para Production, Preview y Development.
5. Haz un nuevo deploy.

La app guarda el progreso en `game_progress` si hay una sesión de usuario autenticada. Para este MVP, el inicio de sesión es opcional; se incluye un botón para crear una sesión anónima de Supabase. Activa **Authentication → Sign In / Providers → Anonymous Sign-Ins** en Supabase para usarlo.

## Desplegar en Vercel
- Sube esta carpeta a un repositorio de GitHub.
- En Vercel selecciona **Add New → Project** y conecta el repositorio.
- Framework: Vite (detección automática).
- Build command: `npm run build`
- Output directory: `dist`
- Configura las dos variables de entorno anteriores y despliega.

## Incluye
- 4 casos: entrevista testimonial, investigación corporativa, conflicto comunitario y delito ambiental.
- Niveles: Difícil, Muy difícil, Avanzado y Experto.
- Entrevistas con opciones de decisión, feedback formativo y puntuación.
- Escena interactiva 3D (habitación de investigación y puntos de inspección clicables).
- Panel de hipótesis y evidencias.
- Persistencia local y sincronización con Supabase cuando hay conexión autenticada.
- Diseño adaptable a móvil y escritorio.

## Nota académica
Los escenarios son ficticios. El juego enseña a formular y contrastar hipótesis; no diagnostica trastornos ni permite inferir culpabilidad a partir de nerviosismo, apariencia o rasgos personales. Toda conclusión debe considerar evidencia verificable, alternativas y límites.
