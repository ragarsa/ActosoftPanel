const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId:};

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
        let innerHTML = '<ul>'
        courses.forEach(function(course) {
            innerHTML += `
            <li>
                <div> <a href='detailcourse.html'> ${course.title} </a> </div>
                <div> ${course.description} </div>
                <div> ${course.startDate} </div>
                <div> ${course.duration} </div>
                <div> ${course.teacher} </div>
                ${course.image ?
                    `<img src="${course.image}" alt="image" width="50" height="50">` 
                    : 'imagen no disponible'
                }
            </li>
            `

        })
        innerHTML += '</ul>'
        messagesContainer.innerHTML += innerHTML;
    })
})


const mockDataCourses = [
    {
        title: 'Python Foundamentals',
        description: 'This course is for learning the basics of the Python language.',
        duration: '24 hrs',
        instructor: 'Martín Melo'
    },
    {
        title: 'Django Basics',
        description: 'This course is for learning the basics of the web development with Django.',
        duration: '24 hrs',
        instructor: 'Martín Melo' 
    },
    {
        title: 'Web Design Basics',
        description: 'This course is for learning the basics of development web services and apps',
        duration: '24 hrs',
        instructor: 'Martín Melo'
    }
]

//Llamamos el DOM con el id asignado a list
/*
const listCoursesSection = document.querySelector('#list-before')

const getCourses = () => {
    let coursesHtml = '';
    mockDataCourses.forEach(course => {
        const html = `
        <article> 
            <h3> ${course.title} </h3>
            <p> ${course.description} </p>
        </article>
        `
        coursesHtml += html
    })
    listCoursesSection.innerHTML += coursesHtml
}

document.addEventListener('DOMContentLoaded', getCourses())
*/
