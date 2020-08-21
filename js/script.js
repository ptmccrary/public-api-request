const search = document.getElementById('search-container');
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

fetchData('https://randomuser.me/api/?results=12')
    .then(data => {
        console.log(data);
        generateGallery(data.results)
        modalListener(data.results);
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

function generateGallery(data) {
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

function modalHTML(data, i) {
    const modalContainer = document.createElement('DIV');
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
    </div>`
    modalContainer.innerHTML = modal;
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

// Close the Modal Window

function removeModal() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.remove();
}

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