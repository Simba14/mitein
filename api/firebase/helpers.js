export const getDocData = (doc) => {
  if (doc.exists) {
    return doc.data();
  } else {
    console.log('No such document!', { doc });
  }
};

export const getQuerySnapshotData = (querySnapshot) =>
  querySnapshot.docs.map((doc) => doc.data());
