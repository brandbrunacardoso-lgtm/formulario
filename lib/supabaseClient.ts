import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Isso só deve acontecer se as variáveis de ambiente não tiverem sido configuradas.
  // eslint-disable-next-line no-console
  console.error(
    "Variáveis de ambiente do Supabase não configuradas (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");

/** Nome do bucket de anexos já existente no projeto Supabase. */
export const ANEXOS_BUCKET = "Anexos";

/** Nome da tabela já existente usada para armazenar os briefings enviados. */
export const BRIEFINGS_TABLE = "briefings";
