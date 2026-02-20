import { db, auth } from './firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

export async function saveToHistory(type: string, input: string, output: any) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, 'history'), {
    userId: user.uid,
    type,
    input,
    output,
    timestamp: new Date().toISOString(),
  });
}

export async function getHistory(limitCount = 20) {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, 'history'),
    where('userId', '==', user.uid),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Fallback: get all user history without ordering
    const simpleQuery = query(
      collection(db, 'history'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(simpleQuery);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limitCount);
  }
}
