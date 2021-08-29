export const getDocData = doc => {
  console.log({ doc });
  if (doc.exists) {
    return doc.data();
  } else {
    console.log('No such document!', { doc });
    throw new Error('No such document');
  }
};

export const getQuerySnapshotData = querySnapshot =>
  querySnapshot.docs.map(doc => doc.data());
