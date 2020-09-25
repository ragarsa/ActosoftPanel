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

//const googleButton = document.querySelector('#loginWithGoogle')
//const logoutButton = document.querySelector('#logout')
//const userInfoContainer = document.querySelector('#user-info')
const imageInput = document.querySelector('#imageInput')


function uploadToStorage(file, docId) { 
    return new Promise(function (resolve, reject) {
        const imageRef = storage.ref(`courses/images/${docId}.${file.type.split('/')[1]}`)
        imageRef.put(file)
            .then(()=>{
                imageRef.getDownloadURL()
                    .then(function(url){
                        resolve(url)
                    })
                    .catch((error)=>{
                        console.log(error)
                        reject(error)
                    })
            })
            .catch((error)=>{
                console.log(error)
                reject(error)
            })
    })
}

sendButton.addEventListener('click', (event)=>{
    event.preventDefault()
    const image = imageInput.files[0]
    db.collection('courses').add({
        title: titleInput.value,
        description: descriptionInput.value,
        teacher: authorInput.value,
        duration: durationInput.value,
        startDate: dateInput.value,
        timestamp: firebase.firestore.Timestamp.now()
    }).then(function(docRef){
        uploadToStorage(image, docRef.id)
            .then(function(url) {
                db.collection('courses').doc(docRef.id).update({
                    image:url
                }).then(function() {
                    console.log('Exitoso')
                }).catch(function(error){
                    console.log('No exitoso')
                })
            })
    }).catch(function(error){
        console.log(error)
        alert('No se pudo guardar el curso')
    })
    messagesContainer.innerHTML = ''
})

document.addEventListener('DOMContentLoaded', function (){
    db.collection('courses')
    .orderBy("timestamp","asc")
    .onSnapshot(function(querySnapshot) {
        messagesContainer.innerHTML = ''
        const courses = []
        querySnapshot.forEach(function(item){
            courses.push(item.data())
        })
        let innerHTML = '<article>'
        courses.forEach(function(course) {
            innerHTML += `
                <button class="collapsable"> ${course.title} </button>
                <div class="collapse"> ${course.description} </div>
                <div class="collapse"> ${course.startDate} </div>
                <div class="collapse"> ${course.duration} </div>
                <div class="collapse"> ${course.teacher} </div>
                ${course.image ?
                    `<img src="${course.image}" alt="image" width="50" height="50">` 
                    : '<div class="collapse">imagen no disponible</div>'
                }
        
            `

        })
        innerHTML += '</article>'
        messagesContainer.innerHTML += innerHTML;
    })
})


let coll = document.querySelectorAll('.collapsable');


for (let i = 0; i < coll.length; i++) {
    console.log(coll)
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var collapse = this.nextElementSibling;
        if (collapse.style.display === "block") {
            collapse.style.display = "none";
        } else {
            collapse.style.display = "block";
        }
    })
}