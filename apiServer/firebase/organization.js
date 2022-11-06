import { Firestore } from '@api/firebase';
import { getDocData, getQuerySnapshotData } from '@api/firebase/helpers';
import {
  FirebaseCreateDocError,
  FirebaseGetDocError,
} from '@api/firebase/errors';
import { COLLECTION_ORGANIZATIONS } from '@api/firebase/constants';

const Organization = {};

Organization.create = async ({ id, organization }) =>
  Firestore.collection(COLLECTION_ORGANIZATIONS)
    .doc(id)
    .set(organization)
    .then(() => organization)
    .catch(() => {
      throw new FirebaseCreateDocError('Creation of Organization doc failed');
    });

Organization.ById = async id =>
  Firestore.collection(COLLECTION_ORGANIZATIONS).doc(id).get().then(getDocData);

Organization.byUserId = async id =>
  Firestore.collection(COLLECTION_ORGANIZATIONS)
    .where('userId', '==', id)
    .get()
    .then(getDocData)
    .catch(() => {
      throw new FirebaseGetDocError('Could not return Organization by user');
    });

Organization.volunteerWith = async () =>
  Firestore.collection(COLLECTION_ORGANIZATIONS)
    .where('needsVolunteers', '==', true)
    .get()
    .then(getQuerySnapshotData)
    .catch(() => {
      throw new FirebaseGetDocError(
        'Could not return Organization by volunteerWith',
      );
    });

export default Organization;
