"use client";

import styles from "./TextField.module.css";

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextField({ id, value, onChange }: TextFieldProps) {
  return (
    <textarea
      id={id}
      className={styles.textarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Digite sua resposta"
      rows={4}
    />
  );
}
