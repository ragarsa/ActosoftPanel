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
//Authentication firebase
//const provider = new firebase.auth.GoogleAuthProvider();
//Send button
const sendButton = document.querySelector('#sendDataCourse')
const titleInput = document.querySelector('#titleCourse')
const descriptionInput = document.querySelector('#descriptionCourse')
const authorInput = document.querySelector('#authorCourse')
const dateInput = document.querySelector('#dateCourse')
const durationInput = document.querySelector('#durationCourse')
const messagesContainer = document.querySelector('#listBefore')
const textContainer = document.querySelector('#textContainer')

//const googleButton = document.querySelector('#loginWithGoogle')
//const logoutButton = document.querySelector('#logout')
//const userInfoContainer = document.querySelector('#user-info')
const imageInput = document.querySelector('#imageInput')


function uploadToStorage(file, docId) {
    return new Promise(function (resolve, reject) {
        const imageRef = storage.ref(`courses/images/${docId}.${file.type.split('/')[1]}`)
        imageRef.put(file)
            .then(() => {
                imageRef.getDownloadURL()
                    .then(function (url) {
                        resolve(url)
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

sendButton.addEventListener('click', (event) => {
    event.preventDefault()
    const image = imageInput.files[0]
    db.collection('courses').add({
        title: titleInput.value,
        description: descriptionInput.value,
        teacher: authorInput.value,
        duration: durationInput.value,
        startDate: dateInput.value,
        timestamp: firebase.firestore.Timestamp.now()
    }).then(function (docRef) {
        uploadToStorage(image, docRef.id)
            .then(function (url) {
                db.collection('courses').doc(docRef.id).update({
                    image: url
                }).then(function () {
                    console.log('Exitoso')
                }).catch(function (error) {
                    console.log('No exitoso')
                })
            })
    }).catch(function (error) {
        console.log(error)
        alert('No se pudo guardar el curso')
    })
    messagesContainer.innerHTML = ''
    buttonDetail.innerHTML = ''

})

document.addEventListener('DOMContentLoaded', function () {
    db.collection('courses')
        .orderBy("timestamp", "asc")
        .onSnapshot(function (querySnapshot) {
            messagesContainer.innerHTML = ''

            const courses = []
            querySnapshot.forEach(function (item) {
                courses.push({'id':item.id, ...item.data()})
                console.log(item)
            })
            let innerHTML = ''

            courses.forEach(function (course) {
                
                btn = courses.map(course => `<button id="${course.id}" onclick="functional(this)"> ${course.title} </button>`)
                messagesContainer.innerHTML = btn.join(' ')
                console.log(course.id)

            
                innerHTML += `
              
              
                `


            })
            innerHTML += ''

            messagesContainer.innerHTML += innerHTML;

        })

})



function functional(id) {
    db.collection('courses').doc(id.id).get().then(doc => {
        
        if (doc.exists){
            textContainer.innerHTML = `<p> Descripción: ${doc.data().description} </p>
                                       <p> Maestro: ${doc.data().teacher} </p>
                                       <p> Duración: ${doc.data().duration} </p>
                                       <button onClick="deleteCourse(this)"> Eliminar este curso </button> 
                                       <button onClick="update(this)"> Actualizar este curso </button>
                                       `
            console.log(doc.data().description)
        }else{
            console.log('nop :(')
        }
        })
    
    console.log(id.id)
}

function deleteCourse(id){
    
    alert('curso eliminado'+id.id)

}
/*
FOR STUDENTS .HTML
*/

