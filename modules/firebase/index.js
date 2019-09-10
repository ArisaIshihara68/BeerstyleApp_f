import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import * as Expo from 'expo'

const FACEBOOK_APPID = '2183744385036581'

const config = {
    apiKey: "AIzaSyCTSIYjX1XBRscC_2oF3pvJkSrAqe9ZPBY",
    authDomain: "beerstyle-aa7ce.firebaseapp.com",
    databaseURL: "https://beerstyle-aa7ce.firebaseio.com",
    projectId: "beerstyle-aa7ce",
    storageBucket: "beerstyle-aa7ce.appspot.com",
    messagingSenderId: "772889188900"
}

firebase.initializeApp(config)

// auth

export const auth = firebase.auth()

export const getUid = () => {
  const user = firebase.auth().currentUser

  if (user) {
    return { uid: user.uid }
  }
  else {
    return { uid: null }
  }
}

export const authFacebook = async () => {
  try {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APPID,
      { permissions: ['public_profile'] }
    )

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      return firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => console.log(error))
    }
    else {
      return { cancelled: true　}
    }
  }
  catch (e) {
    return { error: true }
  }
}

export const logout = () => {
  return firebase.auth().signOut()
}

// firestore

export const db = firebase.firestore()
export const userCollection = db.collection('User')
export const feedCollection = db.collection('Feed')
export const likeCollection = db.collection('Like')

export const getNowDate = () => {
  return firebase.firestore.FieldValue.serverTimestamp()
}

export const getNewFeedDoc = () => {
  return feedCollection.doc()
} 

// storage

const storageRef = firebase.storage().ref()
export const userRef = storageRef.child('User')
export const feedRef = storageRef.child('User')

export const uploadAvatar = async(uri) => {
  const { uid } = getUid()
  const avatarRef = userRef.child(`${uid}/Avatar/main.png`)

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      resolve(xhr.response)
    }

    xhr.onerror = e => {
      console.log(e)
      reject(new TypeError('Network request failed'))
    }

    xhr.responseType = 'blob'
    xhr.open('GET', uri, true)
    xhr.send(null)
  })

  const snapshot = await avatarRef.put(blob)
  blob.close()
  return await snapshot.ref.getDownloadURL()
}

export const uploadFeedImage = async(uri, uuid) => {
  const { uid } = getUid()
  const feedImageRef = userRef.child(`${uid}/Feed/${uuid}/main.png`)

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      resolve(xhr.response)
    }

    xhr.onerror = e => {
      console.log(e)
      reject(new TypeError('Network request failed'))
    }

    xhr.responseType = 'blob'
    xhr.open('GET', uri, true)
    xhr.send(null)
  })

  const snapshot = await feedImageRef.put(blob)
  blob.close()
  return await snapshot.ref.getDownloadURL()
}

export const likepost = async(feed) => {
  try {
    const { uid } = getUid()
    let liked = true;
    await likeCollection.where('Feed_id', '==', feed.uuid).where('User_id', '==', uid).get().then(async (snapshot) => {
      if(snapshot.size === 0) {
        likeCollection.add({User_id: uid, Feed_id: feed.uuid})
        // this.user.doc(`${this.uid}`).collection(`liked`).doc(`${item.pid}`).set({timestamp: Date.now()});
        // this.notification.add({
        //   type: `like`,
        //   uid: item.user.uid,
        //   post: this.post.doc(`${item.pid}`),
        //   from: this.user.doc(`${this.uid}`),
        //   timestamp: Date.now(),
        // });
        liked = true;
      } else {
        snapshot.forEach(like => {
          likeCollection.doc(like.id).delete()
        })
        // this.user.doc(`${this.uid}`).collection(`liked`).doc(`${item.pid}`).delete();
        // const querySnapshot = await this.notification.where(`type`, `==`, `like`).where(`post`, `==`, this.post.doc(`${item.pid}`)).where(`from`, `==`, this.user.doc(`${this.uid}`)).get();
        // await Promise.all(querySnapshot.docs.map(async (d) => {
        //   await d.ref.delete();
        // }));
        liked = false;
      }
    });
    return liked;
  } catch ({ message }) {
    return { error: message };
  }
}
