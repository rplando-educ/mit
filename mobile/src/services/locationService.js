import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export function subscribeToLocations(callback) {
  const q = query(collection(db, 'locations'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function getLocation(id) {
  const snap = await getDoc(doc(db, 'locations', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function uriToBlob(uri) {
  const response = await fetch(uri);
  return response.blob();
}

export async function uploadLocationPhotos(assets, userId) {
  const uploads = (assets || []).map(async (asset) => {
    const blob = await uriToBlob(asset.uri);
    const filename = asset.fileName || `${Date.now()}.jpg`;
    const fileRef = ref(storage, `locations/${userId}/${Date.now()}-${filename}`);
    await uploadBytes(fileRef, blob);
    return getDownloadURL(fileRef);
  });

  return Promise.all(uploads);
}

export async function createLocation(data, photos, user) {
  const photoUrls = await uploadLocationPhotos(photos, user.uid);
  return addDoc(collection(db, 'locations'), {
    ...data,
    photos: photoUrls,
    contributorId: user.uid,
    contributorName: user.displayName || user.email,
    status: 'pending',
    verified: false,
    upvotes: 0,
    reports: 0,
    timestamp: serverTimestamp(),
  });
}
