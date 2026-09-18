import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Nome do bucket de anexos já existente no projeto Supabase. */
export const ANEXOS_BUCKET = "Anexos";

/** Nome da tabela já existente usada para armazenar os briefings enviados. */
export const BRIEFINGS_TABLE = "briefings";

let cachedClient: SupabaseClient | null = null;

/**
 * Cria (ou reaproveita) o cliente Supabase apenas no momento em que ele é
 * realmente usado — nunca no carregamento do módulo. Isso evita que o build
 * da Vercel quebre caso as variáveis de ambiente ainda não tenham sido
 * configuradas no painel do projeto (o .env.local não vai para o Git).
 */
export function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Configuração do Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY nas variáveis de ambiente do projeto (na Vercel: Settings → Environment Variables)."
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}
