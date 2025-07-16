import styles from './RatingStars.module.css';

type RatingStarsProps = {
  score: number; // de 1 a 5
};

export default function RatingStars({ score }: RatingStarsProps) {
  return (
    <div className={styles.stars} aria-label={`Puntuación: ${score} de 5`} title={`Puntuación: ${score}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? styles.filled : styles.empty}>
          ★
        </span>
      ))}
    </div>
  );
}
