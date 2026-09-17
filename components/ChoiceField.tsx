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

const OUTRO_LABEL = "Outro";

export default function ChoiceField({
  id,
  options,
  hasOther,
  hasQual,
  value,
  onChange,
}: ChoiceFieldProps) {
  const selected = value.selected ?? [];
  const isOutroSelected = selected.includes(OUTRO_LABEL);

  function toggleOption(option: string) {
    const isSelected = selected.includes(option);
    const nextSelected = isSelected
      ? selected.filter((o) => o !== option)
      : [...selected, option];

    onChange({ ...value, selected: nextSelected });
  }

  return (
    <div>
      <div className={styles.optionsGrid} role="group" aria-labelledby={id}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <label
              key={option}
              className={`${styles.optionPill} ${
                isSelected ? styles.optionPillSelected : ""
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          );
        })}

        {hasOther && (
          <label
            className={`${styles.optionPill} ${
              isOutroSelected ? styles.optionPillSelected : ""
            }`}
          >
            <input
              type="checkbox"
              checked={isOutroSelected}
              onChange={() => toggleOption(OUTRO_LABEL)}
            />
            {OUTRO_LABEL}
          </label>
        )}
      </div>

      {hasOther && isOutroSelected && (
        <div className={styles.extraField}>
          <input
            type="text"
            className={styles.extraInput}
            placeholder="Qual"
            value={value.outroTexto ?? ""}
            onChange={(e) => onChange({ ...value, outroTexto: e.target.value })}
          />
        </div>
      )}

      {hasQual && (
        <div className={styles.extraField}>
          <input
            type="text"
            className={styles.extraInput}
            placeholder="Qual"
            value={value.qualTexto ?? ""}
            onChange={(e) => onChange({ ...value, qualTexto: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
