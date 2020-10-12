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
const provider = new firebase.auth.GoogleAuthProvider();
//Send button
const sendButton = document.querySelector('#sendDataCourse')
const titleInput = document.querySelector('#titleCourse')
const descriptionInput = document.querySelector('#descriptionCourse')
const authorInput = document.querySelector('#authorCourse')
const dateInput = document.querySelector('#dateCourse')
const durationInput = document.querySelector('#durationCourse')
const messagesContainer = document.querySelector('#listBefore')
const textContainer = document.querySelector('#textContainer')
const coursesContent = document.querySelector('#studentCourses')
const buttonContent = document.querySelector('#buttonContent')
const updateForm = document.querySelector('#updateForm')
const titleInputUp = document.querySelector('#titleCourseUp')
const descriptionInputUp = document.querySelector('#descriptionCourseUp')
const authorInputUp = document.querySelector('#authorCourseUp')
const dateInputUp = document.querySelector('#dateCourseUp')
const durationInputUp = document.querySelector('#durationCourseUp')

//const googleButton = document.querySelector('#loginWithGoogle')
//const logoutButton = document.querySelector('#logout')
//const userInfoContainer = document.querySelector('#user-info')
const imageInput = document.querySelector('#imageInput')
const userContainer = document.querySelector('#userContent')

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userContainer.innerHTML = `
                <p>${user.displayName}</p>
                <img src="${user.photoURL}" style= width:250px height:250px"/>
            `
        console.log(user.uid)

        console.log('Está logeado', user)

    } else {
        console.log('No está logueado')
        userContainer.innerHTML = ''


    }
})


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
                courses.push({ 'id': item.id, ...item.data() })
                // console.log(item)
            })
            let innerHTML = ''

            courses.forEach(function (course) {

                let btn = courses.map(course => `<button id="${course.id}" onclick="functional(this)"> ${course.title} </button>`)
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

        if (doc.exists) {
            textContainer.innerHTML = `<p> Descripción: ${doc.data().description} </p>
                                       <p> Maestro: ${doc.data().teacher} </p>
                                       <p> Duración: ${doc.data().duration} </p>
                                       <p> Fecha de inicio: ${doc.data().startDate} </p>
                                       <img src="${doc.data().image}" style= width:250px height:250px"/>
                                       `
            console.log(doc.data().description)
            db.collection('students').get().then(snap => {

                snap.forEach(st => {

                    for (i in st.data().courses) {
                        if (st.data().courses[i] == doc.data().title) {
                            coursesContent.innerHTML = `<p>${st.data().firstName} ${st.data().surname}</p>`
                            buttonContent.innerHTML = ` <button id="${id.id}" onClick="deleteCourse(this)"> Eliminar este curso </button> 
                                                        <button id="${id.id}" onClick="updateCourse(this)"> Actualizar este curso </button>`
                        } else {
                            coursesContent.innerHTML = `<p>No hay alumnos inscritos aún</p>`
                            buttonContent.innerHTML = ` <button id="${id.id}" onClick="deleteCourse(this)"> Eliminar este curso </button> 
                                                        <button id=${id.id} onClick="updateCourse(this)"> Actualizar este curso </button>`

                        }
                    }
                    



                })


            })


        } else {
            console.log('nop :(')
        }
    })

    console.log(id.id)
}

function deleteCourse(id) {
    db.collection('courses').doc(id.id).delete().then(() => {
        alert('curso eliminado' + id.title)
        location.reload();
    }).catch(error => {
        alert('No se ha podido eliminar' + error)
    })
}

function updateCourse(id){
    db.collection('courses').doc(id.id).get().then(form => {
        if (form.exists){
            updateForm.innerHTML = `
            <h2> Actualización de curso </h2>
            <label for="title-course">Título del curso</label>
            <input 
                type="text"
                placeholder="${form.data().title}"
                name="title"
                id="titleCourseUp"
                class="message">
            <label for="descriptionCourse"></label>
            <textarea 
                name="description" 
                id="descriptionCourseUp" 
                cols="30" 
                rows="10"
                class="message"
                placeholder="${form.data().description}"></textarea>
            <label for="authorCourse">Introduce el nombre del instructor:</label>
            <input 
                type="text"
                placeholder="${form.data().teacher}"
                class="message"
                id="authorCourseUp">
            <label for="dateCourse">Start Date</label>
            <input placeholder = "${form.data().startDate}" 
            class="textbox-n" type="text" onfocusin="(this.type='date')" onfocusout="(this.type='text')"  id="date">
            <label for="durationCourse">Duration</label>
            <input 
                type="text"
                id="durationCourseUp"
                class="message"
                placeholder = "${form.data().duration}"
            >
            <label for="imageInput">Add an image</label>
            <input 
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                id="imageInputUp"
                class="message"
            >
            <button id="sendDataCourseUpdate" onclick="updateData(this)">Actualizar</button>
            ` 
        }
    })
}

function updateData(id){

}





/*
FOR STUDENTS .HTML
*/


