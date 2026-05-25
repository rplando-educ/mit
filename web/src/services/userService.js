import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export function subscribeToUsers(callback) {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    () => callback([]),
  );
}

export function updateUserRole(userId, role) {
  return updateDoc(doc(db, 'users', userId), {
    role,
    updatedAt: serverTimestamp(),
  });
}
