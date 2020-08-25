const body = document.querySelector('body');
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');

/**
 *  FETCH API
 */

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('There was a problem', error))
}

fetchData('https://randomuser.me/api/?results=12&nat=US')
    .then(data => {
        galleryHTML(data.results);
        modalListener(data.results);
        generateSearch();
    })

/**
 *  Helpers
 */

    function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Gallery
 */

// Creates HTML for the user gallery

function galleryHTML(data) {
    const employees = data.map(user => `
        <div class='card'>
            <div class='card-img-container'>
                <img class='card-img' src='${user.picture.large}' alt='profile picture'>
            </div>
            <div class='card-info-container'>
                <h3 id='name' class='card-name cap'>${user.name.first} ${user.name.last}</h3>
                <p class='card-text'>${user.email}</p>
                <p class='card-text cap'>${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`).join('');
    gallery.innerHTML = employees;
}

/**
 * Modal
 */

// Creates HTML for modal window

const modalContainer = document.createElement('DIV');

function modalHTML(data, i) {
    modalContainer.className = 'modal-container';
    let modal = `
    <div class='modal'>
        <button onclick='removeModal()' type='button' id='modal-close-btn' class='modal-close-btn'><strong>X</strong></button>
        <div class='modal-info-container'>
            <img class='modal-img' src='${data[i].picture.large}' alt='profile picture'>
            <h3 id='name' class='modal-name cap'>${data[i].name.first} ${data[i].name.last}</h3>
            <p class='modal-text'>${data[i].email}</p>
            <p class='modal-text cap'>${data[i].location.city}</p>
            <hr>
            <p class="modal-text">Phone: ${formatPhoneNumber(data[i].phone)}</p>
            <p class="modal-text">${data[i].location.street.number} ${data[i].location.street.name}, ${data[i].location.city}, ${data[i].location.state} ${data[i].location.postcode}</p>
            <p class="modal-text">Birthday: ${formatBirthday(data[i].dob.date)}</p>
        </div>
        <div class='modal-btn-container'>
            <button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
            <button type='button' id='modal-next' class='modal-next btn'>Next</button>
        </div>
    </div>`;
    modalContainer.innerHTML = modal;

    modalSwitch(data, i);
    return modalContainer;
}

// Listens for click inside of any card

function modalListener(data) {
    const card = document.querySelectorAll('.card');
    for (let i = 0; i < card.length; i++) {
        card[i].addEventListener('click', () => {
            document.querySelector('body').appendChild(modalHTML(data, i));
        });
    }
}

// Switches between modals

function modalSwitch(data, i) {
    const card = gallery.querySelectorAll('.card');

    const prev = modalContainer.querySelector('.modal-prev');
    prev.addEventListener('click', (e) => {
        if(i > 0) {
            modalHTML(data, i - 1);
        } else {
            modalHTML(data, i + (card.length - 1));
        }
    })

    const next = modalContainer.querySelector('.modal-next');
    next.addEventListener('click', (e) => {
        if(i < card.length - 1) {
            modalHTML(data, i + 1);
        } else {
            modalHTML(data, i - (card.length - 1));
        }
    })
}

// Close the Modal Window

function removeModal() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.remove();
}

window.addEventListener('click', (e) => {
    if(e.target == modalContainer) {
        modalContainer.remove();
    }
});

// Reformat phone number

function formatPhoneNumber(data) {
    let cleaned = ('' + data).replace(/\D/g, '')
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return 'None'
}

// Reformat birthday

function formatBirthday(data) {
    let date = new Date(data)
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let birthday = `${month}/${day}/${year}`
    return birthday;
}

/**
 *  Search
 */

// Creates search bar HTML

function generateSearch() {
    search.innerHTML = `
    <form action='#' method='get'>
        <input type='search' id='search-input' class='search-input' placeholder='Search...'>
        <input type='submit' value="&#x1F50D;" id='search-submit' class='search-submit'>
    </form>`;

    employeeFilter();
}

// Filters users on page with search bar input

function employeeFilter() {
    search.addEventListener('keyup', (e) => {
        const employeeList = document.querySelectorAll('.card');
        const matchedEmployees = [];

        for(let i = 0; i < employeeList.length; i++) {
            let name = employeeList[i].querySelector('#name').textContent.toLowerCase();
            if(name.includes(e.target.value.toLowerCase())) {
                employeeList[i].style.display = '';
                employeeList[i].className = 'card';
                matchedEmployees.push(employeeList[i]);
            } else {
                employeeList[i].style.display = 'none';
                employeeList[i].className = 'card hide';
            }
        }

        const errorCheck = document.querySelector('.error-container');
        if(matchedEmployees.length === 0) {
            if(!errorCheck) {
                generateError();
            }
        } else {
            if(errorCheck) {
                gallery.removeChild(errorCheck);
            }
        }
    })
}

// Creates error to display when no users are matched in search

function generateError() {
    const error = document.createElement('DIV');
    error.className = 'error-container';
    error.innerHTML = `<h3 id='error'>Sorry, no results were found</h3>`;
    gallery.appendChild(error);
}