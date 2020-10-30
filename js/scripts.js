const url = 'https://randomuser.me/api/?results=12';
const users = [];

function fetchData(url) {
	return fetch(url)
           .then(checkStatus)  
           .then(res => res.json())
           .catch(error => console.log('Looks like there was a problem!', error))
}

Promise.all([
  fetchData(url)
])
.then(data => {
	insertHTML(data[0]);
	users.push(data[0]);
	// console.log(users[0]);
});

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function insertHTML(data) {
	for (let i=0; i<data.results.length; i++) {
  		users.push(data.results[i]);
  		// console.log(`${i}`)
  		$('#gallery').append(`<div class="card" id="${i}">
                    <div class="card-img-container">
                        <img class="card-img" src="${data.results[i].picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${data.results[i].name.first} ${data.results[i].name.last}</h3>
                        <p class="card-text">${data.results[i].email}</p>
                        <p class="card-text cap">${data.results[i].location.city}, ${data.results[i].location.state}</p>
                    </div>
                </div>`);
}
$('.card').on('click', (e) => {
	let selected = e.target.id;
	alert(`hi ${selected}`);
	createModalWindow(data, selected);
});
};

// function checkForClick() {
// $('.card').on('click', (e) => {
// 	const selected = event.target.id;
// 	alert(`hi ${selected}`);
// 	createModalWindow(data, selected);
// });
// }
// $.ajax({
//   url: 'https://randomuser.me/api/?results=12',
//   dataType: 'json',
//   success: function(data) {
//   	for (let i=0; i<data.results.length; i++) {
//   		users.push(data.results[i]);
//   		$('#gallery').append(`<div class="card ${i}" id="${i}">
//                     <div class="card-img-container">
//                         <img class="card-img" src="${data.results[i].picture.thumbnail}" alt="profile picture">
//                     </div>
//                     <div class="card-info-container">
//                         <h3 id="name" class="card-name cap">${data.results[i].name.first} ${data.results[i].name.last}</h3>
//                         <p class="card-text">${data.results[i].email}</p>
//                         <p class="card-text cap">${data.results[i].location.city}, ${data.results[i].location.state}</p>
//                     </div>
//                 </div>`);
// }


function createModalWindow(data, selected) {
	let d = data.results[selected].dob.date;
	let bDay = new Date(d);
	let bDayMonth = bDay.getMonth();
	if (bDayMonth < 10) {
		bDayMonth + 0;
	}
	let displayBday = (bDayMonth + 1) + "-" + bDay.getDate() + "-" + bDay.getFullYear()

	$('body').append(`<div class="modal-container">
	                <div class="modal">
	                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
	                    <div class="modal-info-container">
	                        <img class="modal-img" src="${data.results[selected].picture.thumbnail}" alt="profile picture">
	                        <h3 id="name" class="modal-name cap">${data.results[selected].name.first}</h3>
	                        <p class="modal-text">Email: <a href="mailto:${data.results[selected].email}">${data.results[selected].email}</a></p>
	                        <p class="modal-text cap">City: ${data.results[selected].location.city}</p>
	                        <hr>
	                        <p class="modal-text">Phone Number: ${data.results[selected].phone}</p>
	                        <p class="modal-text">Address: ${data.results[selected].location.street.number}
	                        ${data.results[selected].location.street.name}, ${data.results[selected].location.state} ${data.results[selected].location.postcode}</p>
	                        <p class="modal-text">Birthday: ${displayBday}</p>
	                    </div>
	                </div>`)
	$('.modal-close-btn').on('click', () => {
		$('.modal-container').hide();
	})
}

// $('.gallery').on('click', (e) => {
// 	let selected = e.target.id;
// 	alert(`hi ${selected}`);
// 	createModalWindow(data, selected);
// });
