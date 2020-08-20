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