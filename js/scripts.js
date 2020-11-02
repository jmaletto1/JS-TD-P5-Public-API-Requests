/* Here, I have set a few key constants & variables that will be utilised throughout the project.
The first is the URL, which is used to grab the random user's information.
The 2nd is the array which will be used to store their details.
The 3rd constant relates to the DOM element 'gallery', where our info will be displayed.
Lastly, currentModal will keep track of which modal window the user is currently using.
*/

const url = 'https://randomuser.me/api/?results=12';
const users = [];
const gallery = document.getElementById('gallery');
let currentModal = 0;


/*
This function fetches the data from the server, and accepts one parameter - the url that
is being passed in. It calls on the checkStatus function, to confirm if the server has
received a resposne. If it has, the function then parses the result of the fetch using
.json(). Finally if there is an error, a message is logged to the console.

Next, the function is called using Promise.all, and fetchData is passed the url constant
set at the start of the file. Then, the data is sent to the insertHTML function, and the
results are also pushed to the users array.
*/
function fetchData(url) {
	return fetch(url)
           .then(checkStatus)  
           .then(res => res.json())
           .catch(error => console.log('Looks like there was a problem!', error))
}

Promise.all([
  fetchData(url),
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

/* The insertHTML data function receives data from Promise.all, and iterates over the results,
appending a new DOM element for each one. 

It also holds the event listener, which calls the createModalWindow function that opens the 
modal window. It updates the currentModal variable, so that we can keep track of which modal
window the user has open. This will be updated when the user closes or toggles through said
windows.
*/

function insertHTML(data, search=false) {
	if (search) {
		search = search.toUpperCase();
		searchResults = [];

		for (let entry=0; entry<data.results.length; entry++) {
			const firstName = data.results[entry].name.first.toUpperCase();
			const lastName = data.results[entry].name.last.toUpperCase();

			if (firstName.includes(search) || lastName.includes(search)) {
				searchResults.push(data.results[entry]) }
			}

			for (let entry=0; entry<searchResults.length; entry++) {
  		gallery.insertAdjacentHTML('beforeend', `<div class="card" id="${entry}">
                    <div class="card-img-container">
                        <img class="card-img" src="${searchResults[entry].picture.thumbnail}" alt="profile picture">
                    </div>
                    		 <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${searchResults[entry].name.first} ${searchResults[entry].name.last}</h3>
                        <p class="card-text">${searchResults[entry].email}</p>
                        <p class="card-text cap">${searchResults[entry].location.city}, ${searchResults[entry].location.state}</p>
                    </div>
                    
                </div>`);

  	}
  	$('.card').on('click', (e) => {
		let selected = e.target.closest('div.card').id;
		currentModal = parseInt(selected);
		 createModalWindow(searchResults, selected); 
		});

	} else {

	for (let i=0; i<data.results.length; i++) {
  		users.push(data.results[i]);
  		gallery.insertAdjacentHTML('beforeend', `<div class="card" id="${i}">
                    <div class="card-img-container">
                        <img class="card-img" src="${users[i].picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${users[i].name.first} ${users[i].name.last}</h3>
                        <p class="card-text">${users[i].email}</p>
                        <p class="card-text cap">${users[i].location.city}, ${users[i].location.state}</p>
                    </div>
                </div>`);
}

$('.card').on('click', (e) => {
		let selected = e.target.closest('div.card').id;
		currentModal = parseInt(selected);
		 createModalWindow(users, selected); 
		});

if (!search) {
$('.search-container').append(`
<form action="" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit"> 
                        </form>
                        `);
                        // $(':input[type=submit]').prop('disabled', true);

                    }
$('.search-container').on('keyup submit', (e) => {
	e.preventDefault()
	$('#gallery').empty();
	let searchValue = e.target.value;
	insertHTML(data, searchValue);
	if (!e.target.value) {
		$('form:first-child').remove();
		$('#search-input').focus();
	}
})
$('.search-container').on('click', (e) => {
	e.preventDefault()
	if (e.target.value) {
	$('#gallery').empty();
		$('form:first-child').remove();
		$('#search-input').focus();
		insertHTML(data);
	}
})
};
}

/*
The createModalWindow function does exactly that - creates the modal window that
provides more information on the user clicked on by the client.

To add the 0 in front of months and days that are less than 10, I called the new Date()
function, before calling the .getMonth() and .getDate() functions on its result. These
values are then converted to strings, so that a 0 can be appended, if the result is less
than 10.

The modal window also has an eventListener that allows the window to be closed when the
"close" button is clicked. 
*/

function createModalWindow(data, selected) {
	let d = data[selected].dob.date;
	let bDay = new Date(d);
	let bDayMonth = bDay.getMonth();
	bDayMonth += 1;
	bDayMonth.toString();
	if (bDayMonth < 10) {
		bDayMonth = "0" + bDayMonth;
	}

	let bDayDate = bDay.getDate();
	bDayMonth.toString();
	if (bDayDate < 10) {
		bDayDate = "0" + bDayDate;
	}

	let displayBday = (bDayMonth) + "-" + bDayDate + "-" + bDay.getFullYear();

	$('body').append(`<div class="modal-container">
	                <div class="modal">
	                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
	                    <div class="modal-info-container">
	                        <img class="modal-img" src="${data[selected].picture.thumbnail}" alt="profile picture">
	                        <h3 id="name" class="modal-name cap">${data[selected].name.first} ${data[selected].name.last}</h3>
	                        <p class="modal-text"><a href="mailto:${data[selected].email}">${data[selected].email}</a></p>
	                        <p class="modal-text cap">${data[selected].location.city}</p>
	                        <hr>
	                        <p class="modal-text">${data[selected].phone}</p>
	                        <p class="modal-text">${data[selected].location.street.number}
	                        ${data[selected].location.street.name}, ${data[selected].location.state} ${data[selected].location.postcode}</p>
	                        <p class="modal-text">${displayBday}</p>
	                    </div>
	                </div>

	                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`)

	$('.modal-close-btn').on('click', () => {
		$('.modal-container').hide();
		$('.modal-container').remove();
	})
	$('#modal-prev').on('click', () => {
		$('.modal-container').hide();
		$('.modal-container').remove();
		currentModal -= 1;
		if (currentModal >= 0 && currentModal <12 ) {
		createModalWindow(data, currentModal);
	}
	})
	$('#modal-next').on('click', () => {
		$('.modal-container').hide();
		$('.modal-container').remove();
		currentModal += 1;
		if (currentModal >= 0 && currentModal <12 ) {
		createModalWindow(data, currentModal);
	}
	})
}
