// GLOBAL VARIABLES
let request = new XMLHttpRequest();
let url = 'https://www.googleapis.com/books/v1/volumes?q=';
let searchTerms = '';
// This api is restricted to only make calls from this domain
let apiKey = '&maxResults=20&key=AIzaSyBqfUHvXPiHKcQc9KeWA7tVqT05-rHMWHM';
let data = {};

let searchBox = document.querySelector('#search_box');
let submitSearch = document.querySelector('#submit');
let resultShelf = document.querySelector('#result_shelf');

let myShelf = '';
let shelfElement = document.querySelector('#shelf');

// makeRequest() 
//   takes the declared Ajax object and calls on
//   the google books api. If the request is successful, 
//   the function calls the createBook() function, 
//   passing the parsed JSON response stored in the 
//   declared variable `data`.

function makeRequest() {
    request.open('GET', url + searchTerms + apiKey, true);
    request.onload = function () {
        console.log('i am in');
        data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400){
            fetchShelf(); 
            data.items.forEach(function(book){
                let imgLink = '';
                let title = '';
                let author = '';
                let publisher = '';
                let onShelf = false;
                myShelf.indexOf(`${title}; ${author}; ${publisher}; ${img}; ${url} / `) != -1 ? onShelf = true : null;
                if(book.volumeInfo.imageLinks == undefined){
                    imgLink = './public/empty_book_cover.png';
                }else{
                    imgLink = book.volumeInfo.imageLinks.thumbnail;
                };

                if(book.volumeInfo.title == undefined){
                    title = 'Title Not Available';
                }else{
                    title = book.volumeInfo.title;
                };

                if(book.volumeInfo.authors == undefined){
                    author = 'Author Not Available';
                }else{
                    author = book.volumeInfo.authors;
                }

                if(book.volumeInfo.publisher == undefined){
                    publisher = 'Publisher Not Available'
                }else{
                    publisher = book.volumeInfo.publisher;
                }

                let infoLink = book.volumeInfo.infoLink;
                createBook(title, author, publisher, imgLink, infoLink, false, onShelf);
            });
        } else {
            console.log('error');
        }
    };
    request.send();
}

// Event Listeners 
//    1) searchBox is the input field in which the user
//       types their query. An event listener listens for
//       the user to press the `enter` or `return` key. 
//       The listener triggers `grabSearchText()` and then 
//       the `makeRequest()` function.
//    2) submitSearch is the submit button attached to the
//       input field. It is given an event listener for a 
//       click on the botton.
//       The listener triggers `grabSearchText()` and then 
//       the `makeRequest()` function.
//    3) Listener for the `my shelf` display.
//    4) See the createBook() function for additional listeners

searchBox.addEventListener('keyup', function(event) {
    if(event.key == 'Enter'){
        grabSearchText();
        // console.log(searchTerms);
        makeRequest();
    };
})

submitSearch.addEventListener('click', function () {
    grabSearchText();
    // console.log(searchTerms);
    makeRequest();
})

shelfElement.addEventListener('click', function(){
    if(shelfElement.innerText == 'my shelf'){
        shelfElement.innerText = 'my search';
        populateShelf();
    }else{
        shelfElement.innerText = 'my shelf';
        grabSearchText();
        makeRequest();
    };
})

// grabSearchText()
//    takes the value currently in the input box,
//    splits it into an array, then joins it back
//    into a string with `%20` in place of the spaces.
//    This is to format the string to be added as a search
//    query on the api call.
//    It then grabs all elements within the `resultShelf` parent
//    which have a class assignment of `.book`, assigns them to
//    a local variable, `bookArr`, then uses a forEach method 
//    to remove them from the parent.

function grabSearchText(){
    searchTerms = searchBox.value.split(' ').join('%20');
    let bookArr = document.querySelectorAll('.book');
    bookArr.forEach(book => resultShelf.removeChild(book));
}

// createBook()
//    takes in the data from the request, or from the user bookshelf,
//    and populates the data in the form of an element of class
//    `.book`. Each created book is then added to the DOM for viewing.

function createBook(title, author, publisher, imgLink, infoLink, shelf, onShelf) {
    
    let bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    let info = document.createElement('a');
    info.setAttribute('href', infoLink);
    info.setAttribute('target', '_blank');

    let img = document.createElement('img');
    img.setAttribute('src', imgLink);
    img.classList.add('image');

    // Set up a favorite button for the book that will
    // save the book info in localStorage
    let fav = document.createElement('p');
    fav.classList.add('fav');
    if(shelf == false){
        fav.innerText = 'ADD TO SHELF';
        fav.addEventListener('click', function(){
            addToShelf(title, author, publisher, imgLink, infoLink);
            fav.innerText = 'ADDED';
        });
    }else{
        fav.innerText = 'REMOVE FROM SHELF';
        fav.addEventListener('click', function(){
            removeFromShelf(title, author, publisher, imgLink, infoLink);
        });
    }

    if(onShelf){
        fav.innerText = 'ON SHELF';
    }
    


    let titleElement = document.createElement('p');
    titleElement.classList.add('title');
    titleElement.innerText = title;

    let authorElement = document.createElement('p');
    authorElement.classList.add('author');
    authorElement.innerText = author;

    let publisherElement = document.createElement('p');
    publisherElement.classList.add('publisher');
    publisherElement.innerText = publisher;

    // Assemble Element
    info.appendChild(img);
    bookDiv.appendChild(info);
    bookDiv.appendChild(fav);
    bookDiv.appendChild(titleElement);
    bookDiv.appendChild(authorElement);
    bookDiv.appendChild(publisherElement);

    // Append full element to the DOM
    resultShelf.appendChild(bookDiv);
}

// fetchShelf()
//    checks to see if `myShelf` has been created in the user's
//    localStorage. If not, it creates the myShelf key, and set's the
//    value to an empty string and assigns an empty string to the global
//    variable `myShelf`.
//    If `myShelf` is established in localStorage, the function retrieves
//    the value and assigns it to the global variable `myShelf`.

function fetchShelf(){
    if(localStorage.getItem('myShelf') != null){
        myShelf = localStorage.getItem('myShelf');
        console.log('shelf is fetched');
    }else{
      	localStorage.setItem('myShelf', '');
        myShelf = '';
    };
}

// addToShelf()
//    calls `fetchShelf()` to retrieve/create the localStorage value.
//    Then concatenates the value with a new string that represents book
//    information of the clicked book element.

function addToShelf(title, author, publisher, img, url){
    fetchShelf();
    myShelf += `${title}; ${author}; ${publisher}; ${img}; ${url} / `;
    localStorage.setItem('myShelf', myShelf);  
}

// removeFromShelf()
//     calls `fetchShelf()` to retrieve the localStorage value
//     Then searches for the book to be removed, and deletes entry.
//     The new `myShelf` value is assigned back into localStorage.
//     The shelf is repopulated on the DOM for viewing.

function removeFromShelf(title, author, publisher, img, url){
    fetchShelf();
    myShelf = myShelf.replace(`${title}; ${author}; ${publisher}; ${img}; ${url} / `, '');
    localStorage.setItem('myShelf', myShelf);
    populateShelf();
}

// populateShelf() 
//    fetches the myShelf value from localStorage using the `fetchShelf` function,
//    then splits the returned string by `/` which dilineates each book and places 
//    each book as an array within the local `bookArr` variable.
//    It then 

function populateShelf(){
    let bookElementsArr = document.querySelectorAll('.book');
    bookElementsArr.forEach(book => resultShelf.removeChild(book));

    fetchShelf();
    let myShelfArr = [];
    let bookArr = myShelf.split(' / ');
    bookArr.forEach(book => myShelfArr.push(book.split('; ')));
    myShelfArr.pop();
    myShelfArr.forEach(function(shelfItem){
        createBook(shelfItem[0], shelfItem[1], shelfItem[2], shelfItem[3], shelfItem[4]);
    });
}

