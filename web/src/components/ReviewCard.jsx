import { IoStar } from 'react-icons/io5';

export default function ReviewCard({ review }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold">{review.userName}</h4>
        <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
          <IoStar /> {review.rating}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
      <p className="mt-3 text-xs text-slate-400">{review.helpfulVotes || 0} helpful votes</p>
    </article>
  );
}
