import { DatabaseProvider } from '../index';

export class FirebaseDatabase implements DatabaseProvider {
  private config: any;
  private db: any = null;
  private app: any = null;

  constructor(config: any) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      try {
        // Dynamic import to avoid issues if Firebase is not installed
        const { initializeApp } = await import('firebase/app');
        const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');

        this.app = initializeApp(this.config);
        this.db = getFirestore(this.app);

        // Connect to emulator in development
        if (process.env.NODE_ENV === 'development' && this.config.useEmulator) {
          connectFirestoreEmulator(this.db, 'localhost', 8080);
        }

        return true;
      } catch (importError) {
        console.warn('Firebase packages not installed. Install with: npm install firebase');
        return false;
      }
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.app) {
        const { deleteApp } = await import('firebase/app');
        await deleteApp(this.app);
      }
    } catch (error) {
      console.error('Firebase disconnect failed:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.db) return false;
      
      const { doc, getDoc } = await import('firebase/firestore');
      
      // Try to read a test document
      const testDoc = doc(this.db, 'test', 'connection');
      await getDoc(testDoc);
      
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  async create(collection: string, data: any): Promise<any> {
    try {
      const { collection: firestoreCollection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      const newData = {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(firestoreCollection(this.db, collection), newData);
      
      return {
        id: docRef.id,
        ...newData
      };
    } catch (error) {
      console.error('Firebase create failed:', error);
      throw error;
    }
  }

  async read(collection: string, id?: string): Promise<any> {
    try {
      if (id) {
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(this.db, collection, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      } else {
        const { collection: firestoreCollection, getDocs } = await import('firebase/firestore');
        const querySnapshot = await getDocs(firestoreCollection(this.db, collection));
        
        const results: any = {};
        results[collection] = [];
        
        querySnapshot.forEach((doc) => {
          results[collection].push({ id: doc.id, ...doc.data() });
        });
        
        return results;
      }
    } catch (error) {
      console.error('Firebase read failed:', error);
      throw error;
    }
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    try {
      const { doc, updateDoc, getDoc, serverTimestamp } = await import('firebase/firestore');
      
      const docRef = doc(this.db, collection, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      // Return updated document
      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      console.error('Firebase update failed:', error);
      throw error;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      
      const docRef = doc(this.db, collection, id);
      await deleteDoc(docRef);
      
      return true;
    } catch (error) {
      console.error('Firebase delete failed:', error);
      return false;
    }
  }

  async query(collection: string, filters: any): Promise<any[]> {
    try {
      const { 
        collection: firestoreCollection, 
        query, 
        where, 
        orderBy, 
        limit,
        getDocs 
      } = await import('firebase/firestore');
      
      let q = firestoreCollection(this.db, collection);
      
      // Apply filters
      if (filters) {
        const constraints = [];
        
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null) {
            if (key === '_orderBy') {
              constraints.push(orderBy(value.field, value.direction || 'asc'));
            } else if (key === '_limit') {
              constraints.push(limit(value));
            } else {
              constraints.push(where(key, '==', value));
            }
          }
        });
        
        if (constraints.length > 0) {
          q = query(q, ...constraints);
        }
      }
      
      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      return results;
    } catch (error) {
      console.error('Firebase query failed:', error);
      throw error;
    }
  }

  async count(collection: string, filters?: any): Promise<number> {
    try {
      const { 
        collection: firestoreCollection, 
        query, 
        where, 
        getCountFromServer 
      } = await import('firebase/firestore');
      
      let q = firestoreCollection(this.db, collection);
      
      if (filters) {
        const constraints = [];
        
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null && key !== '_orderBy' && key !== '_limit') {
            constraints.push(where(key, '==', value));
          }
        });
        
        if (constraints.length > 0) {
          q = query(q, ...constraints);
        }
      }
      
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error('Firebase count failed:', error);
      return 0;
    }
  }

  async backup(): Promise<any> {
    try {
      // Get all collections (this is a simplified version)
      const collections = ['services', 'bookings', 'customers', 'users', 'messages', 'notifications'];
      const backup: any = {};
      
      for (const collectionName of collections) {
        backup[collectionName] = await this.read(collectionName);
      }
      
      return backup;
    } catch (error) {
      console.error('Firebase backup failed:', error);
      throw error;
    }
  }

  async restore(data: any): Promise<boolean> {
    try {
      const { writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(this.db);
      
      for (const [collectionName, collectionData] of Object.entries(data)) {
        if (Array.isArray(collectionData)) {
          for (const item of collectionData) {
            const { doc } = await import('firebase/firestore');
            const docRef = doc(this.db, collectionName, item.id || '');
            batch.set(docRef, item);
          }
        }
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Firebase restore failed:', error);
      return false;
    }
  }
}
