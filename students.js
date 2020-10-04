
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


const studentForm = document.querySelector("#formStudent")
const firstName = document.querySelector('#firstName')
const surName = document.querySelector('#lastName')
const studentEmail = document.querySelector('#email')
const studentPhone = document.querySelector('#studentPhone')
const studentAge = document.querySelector('#studentAge')
const studentBio = document.querySelector('#studentBio')
const profilePhoto = document.querySelector('#profilePhoto')
const buttonStudent = document.querySelector('#sendStudentData')
const studentContent = document.querySelector('#studentsContent')


document.addEventListener('DOMContentLoaded', function () {
    db.collection('courses')
        .orderBy("timestamp", "asc")
        .onSnapshot(function (querySnapshot) {
            studentForm.innerHTML = ''

            const courses = []
            querySnapshot.forEach(function (item) {
                courses.push({ 'id': item.id, ...item.data() })

            })
            let innerHTML = '<p> Selecciona los cursos del estudiante </p>'

            courses.forEach(function (course) {


                innerHTML += `
                
                <input type="checkbox" id="${course.title}" name="courses" value="${course.title}" class="inputCourses">
                <label for="${course.title}"> ${course.title}</label>
                
              
              
                `


            })
            innerHTML += ''

            studentForm.innerHTML += innerHTML;

        })

})




function uploadToStorage(file, docId) {
    return new Promise(function (resolve, reject) {
        const imageRef = storage.ref(`students/images/${docId}.${file.type.split('/')[1]}`)
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

buttonStudent.addEventListener('click', (event) => {
    let choices = []
    let coursesChoice = document.getElementsByName('courses')
    for (let i = 0; i < coursesChoice.length; i++) {
        if (coursesChoice[i].checked) {
            choices.push(coursesChoice[i].value)

        }
    }
    if (choices == '') {
        choices.push('Este estudiante aún no tiene cursos')
    }

    event.preventDefault()
    const image = profilePhoto.files[0]
    db.collection('students').add({
        firstName: firstName.value,
        surname: surName.value,
        email: studentEmail.value,
        phone: studentPhone.value,
        age: studentAge.value,
        biography: studentBio.value,
        courses: choices,
        timestamp: firebase.firestore.Timestamp.now()
    }).then(function (docRef) {
        uploadToStorage(image, docRef.id)
            .then(function (url) {
                db.collection('students').doc(docRef.id).update({
                    image: url
                }).then(function () {
                    console.log('Exitoso')
                }).catch(function (error) {
                    console.log('No exitoso')
                })
            })
    }).catch(function (error) {
        console.log(error)
        alert('No se pudo guardar el estudiante')
    })
    studentContent.innerHTML = ''


})

document.addEventListener('DOMContentLoaded', function () {
    db.collection('students')
        .orderBy("timestamp", "asc")
        .onSnapshot(function (querySnapshot) {
            studentContent.innerHTML = ''

            const students = []
            querySnapshot.forEach(function (item) {
                students.push({ 'id': item.id, ...item.data() })
                console.log(item)
            })
            let innerHTML = ''

            students.forEach(function (student) {




                innerHTML += `
                    <div> 
                    <p> ${student.firstName} </p> 
                    <p> ${student.courses} </p>
                    </div>
              
                `


            })
            innerHTML += ''

            studentContent.innerHTML += innerHTML;

        })

})

