import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export function subscribeToLocations(callback) {
  const q = query(collection(db, 'locations'), orderBy('timestamp', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    () => callback([]),
  );
}

export async function getLocation(id) {
  const snap = await getDoc(doc(db, 'locations', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function uploadLocationPhotos(files, userId) {
  const uploads = Array.from(files || []).map(async (file) => {
    const fileRef = ref(storage, `locations/${userId}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  });
  return Promise.all(uploads);
}

export async function createLocation(data, files, user) {
  const photos = await uploadLocationPhotos(files, user.uid);
  return addDoc(collection(db, 'locations'), {
    ...data,
    photos,
    contributorId: user.uid,
    contributorName: user.displayName || user.email,
    status: 'pending',
    verified: false,
    upvotes: 0,
    reports: 0,
    timestamp: serverTimestamp(),
  });
}

export async function updateLocation(id, data, files, user) {
  const newPhotos = files?.length ? await uploadLocationPhotos(files, user.uid) : [];
  return updateDoc(doc(db, 'locations', id), {
    ...data,
    photos: [...(data.photos || []), ...newPhotos],
    updatedAt: serverTimestamp(),
  });
}

export function deleteLocation(id) {
  return deleteDoc(doc(db, 'locations', id));
}

export function approveLocation(id, status) {
  return updateDoc(doc(db, 'locations', id), { status, verified: status === 'approved' });
}

export function upvoteLocation(id, currentUpvotes = 0) {
  return updateDoc(doc(db, 'locations', id), { upvotes: currentUpvotes + 1 });
}
