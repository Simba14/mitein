import { Firestore } from '@api/firebase';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';
import {
  FirebaseCreateDocError,
  FirebaseGetDocError,
} from '@api/firebase/errors';
import { COLLECTION_AVAILABILITY } from '@api/firebase/constants';

const Availability = {};

Availability.create = async ({ id, fields }) =>
  Firestore.collection(COLLECTION_AVAILABILITY)
    .doc(id)
    .set(fields)
    .then(() => fields)
    .catch(() => {
      throw new FirebaseCreateDocError('Could not create availability');
    });

Availability.byId = async id =>
  Firestore.collection(COLLECTION_AVAILABILITY).doc(id).get().then(getDocData);

Availability.byUserId = async id =>
  Firestore.collection(COLLECTION_AVAILABILITY)
    .where('userId', '==', id)
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return availability for user');
    });

Availability.deleteById = id =>
  Firestore.collection(COLLECTION_AVAILABILITY).doc(id).delete();

export default Availability;
