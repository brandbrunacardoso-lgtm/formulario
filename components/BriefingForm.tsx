"use client";

import { useState } from "react";
import { steps, TOTAL_STEPS } from "@/data/questions";
import {
  AnswersState,
  ChoiceAnswerValue,
  FilesState,
} from "@/types/briefing";
import { submitBriefing } from "@/lib/submitBriefing";
import StepIndicator from "./StepIndicator";
import QuestionBlock from "./QuestionBlock";
import SuccessScreen from "./SuccessScreen";
import styles from "./BriefingForm.module.css";

const EMPTY_CHOICE: ChoiceAnswerValue = { selected: [] };

export default function BriefingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [files, setFiles] = useState<FilesState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isFirstStep = currentStep === 0;

  function updateTextAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function updateChoiceAnswer(questionId: string, value: ChoiceAnswerValue) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function updateFiles(questionId: string, newFiles: File[]) {
    setFiles((prev) => ({ ...prev, [questionId]: newFiles }));
  }

  function goNext() {
    setErrorMessage(null);
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setErrorMessage(null);
    if (!isFirstStep) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return; // evita envios duplicados por cliques repetidos
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitBriefing(answers, files);

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(
        result.errorMessage ??
          "Ocorreu um problema ao enviar o briefing. Tente novamente."
      );
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>vamos construir juntos o seu projeto</p>
          <h1 className={styles.title}>Briefing de criação de site</h1>
          <p className={styles.subtitle}>
            Responda às perguntas abaixo com calma e conte tudo o que puder
            sobre o seu negócio. Quanto mais detalhes você compartilhar,
            melhor conseguiremos entender suas necessidades e criar algo
            alinhado ao que você procura.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className={styles.card}>
          <h2 className={styles.stepTitle}>{step.title}</h2>

          <div className={styles.questionsWrap}>
            {step.questions.map((question) => (
              <QuestionBlock
                key={question.id}
                question={question}
                textValue={
                  typeof answers[question.id] === "string"
                    ? (answers[question.id] as string)
                    : ""
                }
                choiceValue={
                  (answers[question.id] as ChoiceAnswerValue) ?? EMPTY_CHOICE
                }
                files={files[question.id] ?? []}
                onTextChange={(value) => updateTextAnswer(question.id, value)}
                onChoiceChange={(value) =>
                  updateChoiceAnswer(question.id, value)
                }
                onFilesChange={(f) => updateFiles(question.id, f)}
              />
            ))}
          </div>

          {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

          <div className={styles.footerNav}>
            {!isFirstStep ? (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={goBack}
                disabled={isSubmitting}
              >
                Voltar
              </button>
            ) : (
              <span />
            )}

            <div className={styles.spacer} />

            {!isLastStep ? (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={goNext}
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Briefing"}
              </button>
            )}
          </div>
        </div>

        <p className={styles.footerNote}>
          Etapa {currentStep + 1} de {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}
