import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function reportLocation({ locationId, reason, user }) {
  return addDoc(collection(db, 'reports'), {
    locationId,
    reason,
    reporterId: user.uid,
    status: 'open',
    timestamp: serverTimestamp(),
  });
}
