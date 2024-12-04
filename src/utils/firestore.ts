// src/utils/firestore.ts
import { auth, db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';

// Interface data
export interface Race {
  id?: string;
  nama: string;
  langkah: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const firestoreService = {
  getRaceRef() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    return collection(db, 'users', uid, 'races');
  },

  async addRace(race: Omit<Race, 'id'>) {
    const raceRef = this.getRaceRef();
    const docRef = await addDoc(raceRef, {
      ...race,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getRaces(): Promise<Race[]> {
    const raceRef = this.getRaceRef();
    const q = query(raceRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Race));
  },

  async updateRace(id: string, race: Partial<Race>) {
    const raceRef = this.getRaceRef();
    const docRef = doc(raceRef, id);
    await updateDoc(docRef, {
      ...race,
      updatedAt: Timestamp.now()
    });
  },

  async deleteRace(id: string) {
    const raceRef = this.getRaceRef();
    const docRef = doc(raceRef, id);
    await deleteDoc(docRef);
  },

  async getRaceById(id: string): Promise<Race | null> {
    const raceRef = this.getRaceRef();
    const docRef = doc(raceRef, id);
    const snapshot = await getDoc(docRef);
  
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Race;
    } else {
      return null;
    }
  }
  
};