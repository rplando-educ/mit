import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function reportLocation({ locationId, reason, user }) {
  return addDoc(collection(db, 'reports'), {
    locationId,
    reason,
    userId: user.uid,
    userName: user.displayName || user.email,
    status: 'open',
    timestamp: serverTimestamp(),
  });
}
