import * as functions from 'firebase-functions';

import firebase from 'firebase/app';
import 'firebase/firestore';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const scheduledFunctionPlainEnglish = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    return (await firebase.firestore().collection('items').get()).docs.forEach(
      (doc) => {
        firebase.firestore().collection('items').doc(doc.id).delete();
      }
    );
  });
