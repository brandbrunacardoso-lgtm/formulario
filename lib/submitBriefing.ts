import { supabase, BRIEFINGS_TABLE } from "./supabaseClient";
import { uploadFieldFiles } from "./uploadFiles";
import { steps } from "@/data/questions";
import {
  AnswersState,
  ChoiceAnswerValue,
  FilesState,
  UploadedFilesByField,
} from "@/types/briefing";

function isChoiceAnswer(value: unknown): value is ChoiceAnswerValue {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as ChoiceAnswerValue).selected)
  );
}

/**
 * Monta o objeto de respostas agrupado por etapa, preservando arrays de
 * múltipla seleção e textos integralmente, inclusive campos vazios.
 */
function buildRespostasPayload(answers: AnswersState) {
  const respostas: Record<string, Record<string, unknown>> = {};

  for (const step of steps) {
    const stepPayload: Record<string, unknown> = {};

    for (const question of step.questions) {
      const value = answers[question.id];

      if (question.type === "choice") {
        const choiceValue: ChoiceAnswerValue = isChoiceAnswer(value)
          ? value
          : { selected: [] };

        stepPayload[question.id] = {
          pergunta: question.label,
          selecionadas: choiceValue.selected ?? [],
          outro: choiceValue.outroTexto ?? "",
          qual: choiceValue.qualTexto ?? "",
        };
      } else {
        stepPayload[question.id] = {
          pergunta: question.label,
          resposta: typeof value === "string" ? value : "",
        };
      }
    }

    respostas[step.id] = stepPayload;
  }

  return respostas;
}

/**
 * Envia todos os arquivos pendentes para o Storage, organizados por campo.
 * Se algum upload falhar, a exceção é propagada para permitir nova tentativa
 * sem perder as respostas já preenchidas.
 */
async function uploadAllFiles(
  briefingId: string,
  files: FilesState
): Promise<UploadedFilesByField[]> {
  const arquivosPorCampo: UploadedFilesByField[] = [];

  for (const step of steps) {
    for (const question of step.questions) {
      if (!question.hasFile) continue;

      const selecionados = files[question.id];
      if (!selecionados || selecionados.length === 0) continue;

      const arquivosEnviados = await uploadFieldFiles(
        briefingId,
        question.id,
        selecionados
      );

      arquivosPorCampo.push({
        campoId: question.id,
        pergunta: question.label,
        arquivos: arquivosEnviados,
      });
    }
  }

  return arquivosPorCampo;
}

export interface SubmitResult {
  success: boolean;
  errorMessage?: string;
}

/**
 * Fluxo completo de envio do briefing:
 * 1. Gera um ID único para o envio.
 * 2. Envia todos os arquivos selecionados ao Storage.
 * 3. Insere uma única linha na tabela de briefings com respostas + arquivos.
 *
 * A tela de sucesso só deve ser mostrada quando este método resolver com success = true.
 */
export async function submitBriefing(
  answers: AnswersState,
  files: FilesState
): Promise<SubmitResult> {
  const briefingId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const arquivos = await uploadAllFiles(briefingId, files);
    const respostas = buildRespostasPayload(answers);

    const { error } = await supabase.from(BRIEFINGS_TABLE).insert({
      id: briefingId,
      respostas,
      arquivos,
    });

    if (error) {
      return {
        success: false,
        errorMessage: `Não foi possível salvar suas respostas: ${error.message}`,
      };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro inesperado ao enviar o briefing.";
    return { success: false, errorMessage: message };
  }
}
