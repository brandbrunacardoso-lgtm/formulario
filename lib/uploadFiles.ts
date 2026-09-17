import { supabase, ANEXOS_BUCKET } from "./supabaseClient";
import { UploadedFileRef } from "@/types/briefing";

/** Remove acentos/caracteres especiais para gerar um nome de arquivo seguro no Storage. */
function sanitizeFileName(fileName: string): string {
  const normalized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const safe = normalized.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return safe.length > 0 ? safe : "arquivo";
}

/**
 * Envia um conjunto de arquivos de um campo específico para o Storage,
 * dentro de uma pasta exclusiva do briefing (briefingId/campoId/...).
 * Lança um erro descritivo caso algum upload falhe, permitindo nova tentativa.
 */
export async function uploadFieldFiles(
  briefingId: string,
  campoId: string,
  files: File[]
): Promise<UploadedFileRef[]> {
  const resultados: UploadedFileRef[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const nomeSeguro = sanitizeFileName(file.name);
    const caminho = `${briefingId}/${campoId}/${Date.now()}-${i}-${nomeSeguro}`;

    const { error } = await supabase.storage
      .from(ANEXOS_BUCKET)
      .upload(caminho, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (error) {
      throw new Error(
        `Falha ao enviar o arquivo "${file.name}": ${error.message}`
      );
    }

    resultados.push({
      nome: file.name,
      caminho,
      tamanho: file.size,
      tipo: file.type || "desconhecido",
    });
  }

  return resultados;
}
