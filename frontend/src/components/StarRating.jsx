export default function StarRating({ value = 0, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5]
  const interactive = !!onChange

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${star} star`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= value ? '#00D9FF' : 'none'}
            stroke={star <= value ? '#00D9FF' : '#8B95A5'}
            strokeWidth="1.5"
          >
            <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
          </svg>
        </button>
      ))}
    </div>
  )
}
