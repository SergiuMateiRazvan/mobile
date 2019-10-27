// import * as firebase from 'firebase';
// import 'firebase/firestore';
export const apiUrl = 'http://192.168.0.102:3000/tasks';

// export const firebaseConfig = {
//   apiKey: 'AIzaSyCsbwnCYqzOtG6KWlSPWnA4mTvDFZWILmI',
//   authDomain: 'mobile-b5af6.firebaseapp.com',
//   databaseURL: 'https://mobile-b5af6.firebaseio.com',
//   projectId: 'mobile-b5af6',
//   storageBucket: 'mobile-b5af6.appspot.com',
//   messagingSenderId: '680512580787',
//   appId: '1:680512580787:web:9370914279677fb91014c6',
//   measurementId: 'G-G6Y1LP8BN2',
// };
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const db = firebase.firestore();

// export function login(email, password) {
//   return auth.signInWithEmailAndPassword(email, password);
// }

export function getTasks() {
  return fetch(`${apiUrl}`);
}

export function putTask(task) {
  return fetch(`${apiUrl}/task`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(task),
  });
}
