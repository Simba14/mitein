import { FirebaseGetDocError } from '@api/firebase/errors';

export const getDocData = doc => {
  if (doc.exists()) {
    return doc.data();
  } else {
    throw new FirebaseGetDocError('Document does not exist');
  }
};

export const getQuerySnapshotData = querySnapshot =>
  querySnapshot.docs.map(doc => doc.data());
