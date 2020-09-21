const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "actosoftpanel",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
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
