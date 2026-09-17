"use client";

import { useRef } from "react";
import styles from "./FileField.module.css";

interface FileFieldProps {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileField({ id, files, onChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);
    onChange([...files, ...newFiles]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.dropZone} htmlFor={id}>
        <span>Clique para anexar arquivo(s) ou arraste aqui</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              <span className={styles.fileName}>
                {file.name} ({formatSize(file.size)})
              </span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeFile(index)}
                aria-label={`Remover ${file.name}`}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
