const firebaseConfig = {
    apiKey: "AIzaSyDwGli-mryIZch0j0DF0eihCZXiWbGyblE",
    authDomain: "actosoftpanel.firebaseapp.com",
    databaseURL: "https://actosoftpanel.firebaseio.com",
    projectId: "actosoftpanel",
    storageBucket: "actosoftpanel.appspot.com",
    messagingSenderId: "477113114096",
    appId: "1:477113114096:web:292e0794332bd76b6cd135",
    measurementId: "G-2LG9BXE7LL"
};

firebase.initializeApp(firebaseConfig);
//Database start
const db = firebase.firestore();
//Storage firebase
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const googleButton = document.querySelector('#loginWithGoogle')
const logOutButton = document.querySelector('#logout')
const userContainer = document.querySelector('#userInfo')
const buttonsContainer = document.querySelector('#buttons')

logOutButton.addEventListener('click', event => {
    event.preventDefault();
    if (confirm('Estás seguro de cerrar sesión?')) {
        firebase.auth().signOut()
            .then(function (result) {
                alert('Has salido de la sesión, hasta luego'+result)
            }).catch(function (error) {
                alert('Ha habido un error'+error)
            })
        
    }
})

googleButton.addEventListener('click', event => {
    event.preventDefault();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            console.log(result)
        }).catch(error => {
            console.log(error)
        })
})

document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userContainer.innerHTML = `
                <p>${user.displayName}</p>
                <img src="${user.photoURL}" style= width:250px height:250px"/>
            `
            logOutButton.style.display = 'block'
            googleButton.remove();
            //googleButton.style.display='none'
            console.log('Está logeado', user)
            
        } else {
            console.log('No está logueado')
            userContainer.innerHTML = ''
            buttonsContainer.appendChild(googleButton)
            logOutButton.style.display = 'none'
            
        }
    })
})