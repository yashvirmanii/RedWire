import { Alert } from 'react-native';
import { firebase, usersCollection,articlesCollection,videosCollection } from '../../firebase';


export const registerUser = async({ email,password }) =>{
    try{
        const response = await firebase.auth()
        .createUserWithEmailAndPassword(email,password);

        const {user} = response;
        const userProfile = {
            uid: user.uid,
            email: email
        };
        await usersCollection.doc(user.uid).set(userProfile);
        return { isAuth: true, user:userProfile }
    }catch(error){
        return { error:error.message }
    }
}


export const loginUser = async({ email,password }) =>{
    try{
        const response =await firebase.auth()
        .signInWithEmailAndPassword(email,password);

        const userProfile = await usersCollection.doc(response.user.uid).get();
        const data = userProfile.data();

        return { isAuth: true, user:data }
    }catch(error){
        return { error:error.message }
    }
}

export const autoSignIn = () => (
    new Promise((resolve,reject)=>{
        firebase.auth().onAuthStateChanged( user => {
            if(user){
                usersCollection.doc(user.uid).get().then( snapshot =>{
                    resolve({ isAuth: true, user: snapshot.data() })
                })
            } else {
                resolve({ isAuth: false, user:[] })
            }
        })
    })
)

export const logoutUser = () => (
    firebase.auth().signOut()
)

export const updateUserData = async(values,user) => {
    try{
        const collection = usersCollection.doc(user.uid);
        const update = await collection.update(values);

        const newUser = {
            ...user,
            ...values
        }
        return { user: newUser, error: null }
    }catch(error){
        return { user: user, error: error }
    }
}

/// articles


export const getArticles = async() => {
    try{
        const response = await articlesCollection
        .where('public','==',1)
        .orderBy('createdAt')
        .limit(3)
        .get();

        const lastPostVisible = response.docs[response.docs.length-1];
        const articles = response.docs.map( doc => ({
            id: doc.id,...doc.data()
        }));
        return { posts: articles,lastPostVisible: lastPostVisible }
    }catch(error){
        console.log(error);
        return error
    }
}

export const getMoreArticles = async(articles) => {
    let posts = [...articles.posts];
    let lastPostVisible = articles.lastPostVisible

    try {
        if(lastPostVisible){
            const response = await articlesCollection
            .where('public','==',1)
            .orderBy('createdAt')
            .startAfter(lastPostVisible)
            .limit(2)
            .get();

            lastPostVisible = response.docs[response.docs.length-1];     
            const newArticles = response.docs.map( doc => ({
                id: doc.id,...doc.data()
            }));
            return { posts:[...articles.posts,...newArticles], lastPostVisible}
        }
        return { posts,lastPostVisible}
    } catch(error){
        alert(error)
        return { posts,lastPostVisible}
    }
}


export const getVideos = async() => {
    try{
        const response = await videosCollection
        .where('public','==',1)
        .orderBy('createdAt')
        .limit(3)
        .get();

        const lastVideoVisible = response.docs[response.docs.length-1];
        const videos = response.docs.map( doc => ({
            id: doc.id,...doc.data()
        }));
        return { videos: videos,lastVideoVisible: lastVideoVisible }
    }catch(error){
        console.log(error);
        return error
    }
}


export const getMoreVideos = async(articles) => {
    let videos = [...articles.videos];
    let lastVideoVisible = articles.lastVideoVisible

    try {
        if(lastVideoVisible){
            const response = await videosCollection
            .where('public','==',1)
            .orderBy('createdAt')
            .startAfter(lastVideoVisible)
            .limit(2)
            .get();

            lastVideoVisible = response.docs[response.docs.length-1];     
            const newArticles = response.docs.map( doc => ({
                id: doc.id,...doc.data()
            }));
            return { videos:[...articles.videos,...newArticles], lastVideoVisible}
        }
        return { videos,lastVideoVisible}
    } catch(error){
        alert(error)
        return { videos,lastVideoVisible}
    }
}