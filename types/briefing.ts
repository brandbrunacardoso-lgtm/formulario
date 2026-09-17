export type QuestionType = "text" | "choice";

export interface Question {
  /** Identificador único e estável, usado como chave no JSON salvo no Supabase */
  id: string;
  /** Texto exato da pergunta, exibido ao cliente */
  label: string;
  /** Texto de apoio (hierarquia visual inferior ao enunciado) */
  helperText?: string;
  type: QuestionType;
  /** Opções (apenas para type "choice"). Sempre de múltipla seleção. */
  options?: string[];
  /** Adiciona a opção selecionável "Outro" com campo de texto livre */
  hasOther?: boolean;
  /** Adiciona um campo de texto livre com placeholder "Qual" (sem opção própria) */
  hasQual?: boolean;
  /** Adiciona campo de upload de arquivos (múltiplos) */
  hasFile?: boolean;
}

export interface Step {
  id: string;
  title: string;
  questions: Question[];
}

/** Resposta de uma pergunta de múltipla escolha */
export interface ChoiceAnswerValue {
  selected: string[];
  outroTexto?: string;
  qualTexto?: string;
}

/** Resposta de uma pergunta de texto livre */
export type TextAnswerValue = string;

export type AnswerValue = ChoiceAnswerValue | TextAnswerValue;

/** answers[questionId] = valor da resposta */
export type AnswersState = Record<string, AnswerValue>;

/** files[questionId] = lista de arquivos selecionados (ainda não enviados) */
export type FilesState = Record<string, File[]>;

export interface UploadedFileRef {
  nome: string;
  caminho: string;
  tamanho: number;
  tipo: string;
}

export interface UploadedFilesByField {
  campoId: string;
  pergunta: string;
  arquivos: UploadedFileRef[];
}
