import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export function subscribeToReviews(locationId, callback) {
  const q = query(collection(db, 'reviews'), where('locationId', '==', locationId), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function addReview({ locationId, user, rating, comment }) {
  return addDoc(collection(db, 'reviews'), {
    locationId,
    userId: user.uid,
    userName: user.displayName || user.email,
    rating: Number(rating),
    comment,
    helpfulVotes: 0,
    timestamp: serverTimestamp(),
  });
}
