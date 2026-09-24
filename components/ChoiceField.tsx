"use client";

import { ChoiceAnswerValue } from "@/types/briefing";
import styles from "./ChoiceField.module.css";

interface ChoiceFieldProps {
  id: string;
  options: string[];
  hasOther?: boolean;
  hasQual?: boolean;
  value: ChoiceAnswerValue;
  onChange: (value: ChoiceAnswerValue) => void;
}

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="#f7f4ee"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChoiceField({
  id,
  options,
  hasOther,
  hasQual,
  value,
  onChange,
}: ChoiceFieldProps) {
  const selected = value.selected ?? [];

  function toggleOption(option: string) {
    const isSelected = selected.includes(option);
    const nextSelected = isSelected
      ? selected.filter((o) => o !== option)
      : [...selected, option];

    onChange({ ...value, selected: nextSelected });
  }

  // Um único campo de texto livre, sempre visível, disponível tanto para
  // perguntas que tinham "Outro" quanto para as que já tinham "Qual".
  const showExtraField = hasOther || hasQual;
  const extraValue = hasOther ? value.outroTexto ?? "" : value.qualTexto ?? "";

  function updateExtraValue(text: string) {
    if (hasOther) {
      onChange({ ...value, outroTexto: text });
    } else {
      onChange({ ...value, qualTexto: text });
    }
  }

  return (
    <div>
      <div className={styles.optionsList} role="group" aria-labelledby={id}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <label key={option} className={styles.optionRow}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(option)}
              />
              <span
                className={`${styles.checkbox} ${
                  isSelected ? styles.checkboxChecked : ""
                }`}
              >
                {isSelected && <CheckIcon />}
              </span>
              <span className={styles.optionText}>{option}</span>
            </label>
          );
        })}
      </div>

      {showExtraField && (
        <div className={styles.extraField}>
          <input
            type="text"
            className={styles.extraInput}
            placeholder="Qual..."
            value={extraValue}
            onChange={(e) => updateExtraValue(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
