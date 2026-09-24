"use client";

import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <span className={styles.stepLabel}>
          Etapa {currentStep + 1} de {totalSteps}
        </span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
