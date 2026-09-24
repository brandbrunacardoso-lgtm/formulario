"use client";

import { useEffect, useRef } from "react";
import styles from "./TextField.module.css";

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextField({ id, value, onChange }: TextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cresce sozinho conforme a pessoa digita, começando com apenas uma linha.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      id={id}
      className={styles.textarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Digite sua resposta..."
      rows={1}
    />
  );
}
