export const GOOGLE_RATING = {
  score: "4,9",
  count: "58 avis",
} as const;

type GoogleRatingProps = {
  className?: string;
};

export function GoogleRating({ className = "" }: GoogleRatingProps) {
  return (
    <p
      className={`google-rating ${className}`.trim()}
      aria-label={`${GOOGLE_RATING.score} sur 5, ${GOOGLE_RATING.count} Google`}
    >
      <img
        src="/google-logo.svg"
        alt=""
        height={20}
        width={62}
        className="h-5 w-auto"
        decoding="async"
      />
      <span className="google-rating-sep" aria-hidden="true">
        ·
      </span>
      <span className="google-rating-score">{GOOGLE_RATING.score}</span>
      <span className="google-rating-sep" aria-hidden="true">
        ·
      </span>
      <span className="google-rating-stars" aria-hidden="true">
        ★★★★★
      </span>
      <span className="google-rating-sep" aria-hidden="true">
        ·
      </span>
      <span className="google-rating-count">{GOOGLE_RATING.count}</span>
    </p>
  );
}
