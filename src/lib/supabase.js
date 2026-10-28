import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey && !url.includes('TU-PROYECTO') && !anonKey.includes('TU_CLAVE'));
export const supabase = supabaseConfigured ? createClient(url, anonKey) : null;

export async function ensureAnonymousSession() {
  if (!supabase) throw new Error('Supabase no está configurado. Añade las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (session?.user) return session.user;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

export async function saveProgress(record) {
  if (!supabase) return { mode: 'local' };
  const user = await ensureAnonymousSession();
  const { error } = await supabase.from('game_progress').insert({
    user_id: user.id,
    scenario_id: record.scenarioId,
    difficulty: record.difficulty,
    score: record.score,
    decisions: record.decisions,
    final_hypothesis: record.hypothesis || null,
    completed: true
  });
  if (error) throw error;
  return { mode: 'supabase' };
}

export async function loadProgress() {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];
  const { data, error } = await supabase.from('game_progress')
    .select('id, scenario_id, difficulty, score, created_at, completed')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}
