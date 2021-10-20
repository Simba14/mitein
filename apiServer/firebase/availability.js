import { Firestore } from '@api/firebase';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';

import { COLLECTION_AVAILABILITY } from '@api/firebase/constants';

const Availability = {};

Availability.create = async ({ id, fields }) =>
  Firestore.collection(COLLECTION_AVAILABILITY)
    .doc(id)
    .set(fields)
    .then(() => fields)
    .catch(error => console.log({ error, fields }));

Availability.byId = async id =>
  Firestore.collection(COLLECTION_AVAILABILITY).doc(id).get().then(getDocData);

Availability.byUserId = async id =>
  Firestore.collection(COLLECTION_AVAILABILITY)
    .where('userId', '==', id)
    .get()
    .then(getQuerySnapshotData)
    .catch(error => console.log({ error }));

Availability.deleteById = id =>
  Firestore.collection(COLLECTION_AVAILABILITY).doc(id).delete();

export default Availability;
