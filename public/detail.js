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

const db = firebase.firestore();
const storage = firebase.storage();

const detailContainer = document.querySelector('#courseDetail')


document.addEventListener('DOMContentLoaded', function (){
    db.collection('courses')
    .orderBy("timestamp","asc")
    .onSnapshot(function(querySnapshot) {
        detailContainer.innerHTML = ''
        const courses = []
        querySnapshot.forEach(function(item){
            courses.push(item.data())
        })
        let innerHTML = '<ul>'
            innerHTML += `
            <li>
                <div> <a href='detailcourse.html'> ${courses[0].title} </a> </div>
                <div> ${courses[0].description} </div>
                <div> ${courses[0].startDate} </div>
                <div> ${courses[0].duration} </div>
                <div> ${courses[0].teacher} </div>
                ${courses[0].image ?
                    `<img src="${courses.image}" alt="image" width="50" height="50">` 
                    : 'imagen no disponible'
                }
            </li>
            `
        innerHTML += '</ul>'
        detailContainer.innerHTML += innerHTML;
    })
})