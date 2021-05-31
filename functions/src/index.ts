import * as functions from 'firebase-functions';

import firebase from 'firebase/app';
import 'firebase/firestore';



export const scheduledFunctionPlainEnglish = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    return (await firebase.firestore().collection('items').get()).docs.forEach(
      (doc) => {
        firebase.firestore().collection('items').doc(doc.id).delete();
      }
    );
  });
