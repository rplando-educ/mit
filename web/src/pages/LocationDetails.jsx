import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoFlagOutline, IoPencilOutline, IoStar, IoThumbsUpOutline, IoTrashOutline } from 'react-icons/io5';
import Loader from '../components/Loader';
import MapComponent from '../components/MapComponent';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addReview, subscribeToReviews } from '../services/reviewService';
import { deleteLocation, getLocation, upvoteLocation } from '../services/locationService';
import { reportLocation } from '../services/reportService';
import { ACCESSIBILITY_FEATURES } from '../utils/constants';
import { calculateAccessibilityScore } from '../utils/scoring';

const reviewRatingOptions = [
  { value: 5, label: '5 - Excellent experience' },
  { value: 4, label: '4 - Good experience' },
  { value: 3, label: '3 - Average experience' },
  { value: 2, label: '2 - Difficult experience' },
  { value: 1, label: '1 - Not accessible' },
];

export default function LocationDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation(id).then((item) => {
      setLocation(item);
      setLoading(false);
    });
    const unsubscribe = subscribeToReviews(id, setReviews);
    return unsubscribe;
  }, [id]);

  async function submitReview(event) {
    event.preventDefault();
    await addReview({ locationId: id, user: currentUser, ...review });
    setReview({ rating: 5, comment: '' });
    showToast('Review posted.');
  }

  async function handleDelete() {
    await deleteLocation(id);
    showToast('Location deleted.');
    navigate('/map');
  }

  async function handleReport() {
    if (!currentUser) return navigate('/login');
    await reportLocation({ locationId: id, reason: 'Incorrect or outdated information', user: currentUser });
    showToast('Report submitted to moderators.');
  }

  if (loading) return <Loader />;
  if (!location) return <div className="p-6">Location not found.</div>;
  const isOwner = currentUser?.uid === location.contributorId;

  return (
    <div className="grid max-w-full gap-5 overflow-x-hidden p-3 sm:p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:p-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)]">
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-2xl font-black sm:text-3xl">{location.placeName}</h1>
              <p className="mt-2 break-words text-slate-500 dark:text-slate-400">{location.address}</p>
            </div>
            <span className="rounded-full bg-brand-50 px-4 py-2 font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">Score {calculateAccessibilityScore(location)}</span>
          </div>
          <p className="mt-5 text-slate-700 dark:text-slate-200">{location.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(location.features || []).map((id) => (
              <span key={id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold dark:bg-slate-800">
                {ACCESSIBILITY_FEATURES.find((feature) => feature.id === id)?.label || id}
              </span>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-semibold dark:border-slate-700" onClick={() => upvoteLocation(id, location.upvotes)}>
              <IoThumbsUpOutline /> Helpful {location.upvotes || 0}
            </button>
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-semibold dark:border-slate-700" onClick={handleReport}>
              <IoFlagOutline /> Report
            </button>
            {isOwner && (
              <>
                <Link className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white" to={`/locations/${id}/edit`}><IoPencilOutline /> Edit</Link>
                <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white" onClick={handleDelete}><IoTrashOutline /> Delete</button>
              </>
            )}
          </div>
        </div>

        {location.photos?.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {location.photos.map((photo) => <img key={photo} src={photo} alt={location.placeName} className="h-56 w-full rounded-lg object-cover" />)}
          </div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">Ratings and Reviews</h2>
          {currentUser ? (
            <form onSubmit={submitReview} className="mt-4 grid gap-3">
              <select className="focus-ring rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} aria-label="Review rating">
                {reviewRatingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea className="focus-ring rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" placeholder="Share accessibility details from your visit" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
              <button className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"><IoStar /> Post review</button>
            </form>
          ) : <Link className="mt-4 inline-block font-semibold text-brand-700 dark:text-brand-100" to="/login">Login to review</Link>}
          <div className="mt-5 space-y-3">
            {reviews.map((item) => <ReviewCard key={item.id} review={item} />)}
          </div>
        </section>
      </section>
      <aside className="space-y-4">
        <MapComponent locations={[location]} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold">Contributor</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{location.contributorName || 'Community member'}</p>
          <p className="mt-4 font-semibold">Verification</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{location.verified ? 'Community verified' : 'Pending verification'}</p>
        </div>
      </aside>
    </div>
  );
}
