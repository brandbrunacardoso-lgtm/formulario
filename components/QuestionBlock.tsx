"use client";

import { Question, ChoiceAnswerValue } from "@/types/briefing";
import TextField from "./TextField";
import ChoiceField from "./ChoiceField";
import FileField from "./FileField";
import styles from "./QuestionBlock.module.css";

interface QuestionBlockProps {
  question: Question;
  textValue: string;
  choiceValue: ChoiceAnswerValue;
  files: File[];
  onTextChange: (value: string) => void;
  onChoiceChange: (value: ChoiceAnswerValue) => void;
  onFilesChange: (files: File[]) => void;
}

export default function QuestionBlock({
  question,
  textValue,
  choiceValue,
  files,
  onTextChange,
  onChoiceChange,
  onFilesChange,
}: QuestionBlockProps) {
  return (
    <div className={styles.block}>
      <p className={styles.label} id={question.id}>
        {question.label}
      </p>
      {question.helperText && <p className={styles.helper}>{question.helperText}</p>}

      <div className={styles.fieldArea}>
        {question.type === "text" && (
          <TextField id={question.id} value={textValue} onChange={onTextChange} />
        )}

        {question.type === "choice" && (
          <ChoiceField
            id={question.id}
            options={question.options ?? []}
            hasOther={question.hasOther}
            hasQual={question.hasQual}
            value={choiceValue}
            onChange={onChoiceChange}
          />
        )}

        {question.hasFile && (
          <FileField
            id={`${question.id}-upload`}
            files={files}
            onChange={onFilesChange}
          />
        )}
      </div>
    </div>
  );
}
