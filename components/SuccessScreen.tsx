import styles from "./SuccessScreen.module.css";

export default function SuccessScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="#f7f4ee"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={styles.message}>
          Obrigada por responder ao briefing. Recebemos suas informações e nossa
          equipe entrará em contato com você em breve.
        </p>
      </div>
    </div>
  );
}
