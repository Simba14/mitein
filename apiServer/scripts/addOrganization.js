import { Firestore } from '@api/firebase';
import { COLLECTION_ORGANIZATIONS } from '@api/firebase/constants';
import { v4 as uuidv4 } from 'uuid';
import { log } from '@api/logger';

const docRef = Firestore.collection(COLLECTION_ORGANIZATIONS).doc('FILL ME IN');

const addOrganization = async () => {
  try {
    await docRef.set({
      id: uuidv4(),
      city: 'Calais',
      description: {
        de: 'Wohltätigkeitsorganisation, die Menschen, die vor Krieg, Armut, Verfolgung und Klimawandel fliehen und in Nordfrankreich und Großbritannien leben, nahrhaftes Essen ohne Wertung serviert.',
        en: 'Charity serving nutritious food without judgement to those fleeing war, poverty, persecution and climate change and living in Northern France and the UK.',
      },
      email: 'volunteering@refugeecommunitykitchen.org',
      logo: '//static1.squarespace.com/static/59a7eed512abd9e692dbe3f2/t/6021b57e5796c01b02a1bbe7/1614425928550/?format=1500w',
      name: 'Refugee Community Kitchen',
      website: 'https://www.refugeecommunitykitchen.com/',
      socials: {
        facebook: 'https://www.facebook.com/refugeeCkitchen/',
        instagram: 'https://www.instagram.com/refugeecommunitykitchen/',
        twitter: 'https://twitter.com/RefugeeCKitchen',
      },
    });

    log('Successfully Added Organization');
  } catch (err) {
    log({ err });
  }
};

addOrganization();
