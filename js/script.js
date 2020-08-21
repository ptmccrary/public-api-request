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
        generateGallery(data.results);
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
