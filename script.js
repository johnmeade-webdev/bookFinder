let url = 'https://www.googleapis.com/books/v1/volumes?q=';
let searchTerms = '';
let apiKey = '&maxResults=20&key=AIzaSyBqfUHvXPiHKcQc9KeWA7tVqT05-rHMWHM';
let data = {};
let request = new XMLHttpRequest();
let searchBox = document.querySelector('#search_box');
let myShelf = '';
let myShelfArr = [];

function grabSearchText(){
    searchTerms = searchBox.value.split(' ').join('%20');
    let bookArr = document.querySelectorAll('.book');
    bookArr.forEach(book => resultShelf.removeChild(book));
}

searchBox.addEventListener('keyup', function(event) {
    if(event.key == 'Enter'){
        grabSearchText();
        console.log(searchTerms);
        makeRequest();
    };
})

let submitSearch = document.querySelector('#submit');
submitSearch.addEventListener('click', function () {
    grabSearchText();
    console.log(searchTerms);
    makeRequest();
})


let resultShelf = document.querySelector('#result_shelf');

function createBook(book) {
    let imgLink = book.volumeInfo.imageLinks.thumbnail;
    let authorName = book.volumeInfo.authors;
    let bookName = book.volumeInfo.title;
    let publisherName = book.volumeInfo.publisher;
    let infoLink = book.volumeInfo.infoLink;

    let bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    let info = document.createElement('a');
    info.setAttribute('href', infoLink);

    let img = document.createElement('img');
    img.setAttribute('src', imgLink);
    img.classList.add('image');

    info.appendChild(img);
    bookDiv.appendChild(info);

    let fav = document.createElement('p');
    fav.classList.add('fav');
    fav.innerText = 'ADD TO SHELF';
    fav.addEventListener('click', function(){
        localStorage.setItem()
    })

    bookDiv.appendChild(fav);

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = bookName;

    bookDiv.appendChild(title);

    let author = document.createElement('p');
    author.classList.add('author');
    author.innerText = authorName;

    bookDiv.appendChild(author);

    let publisher = document.createElement('p');
    publisher.classList.add('publisher');
    publisher.innerText = publisherName;

    bookDiv.appendChild(publisher);
    resultShelf.appendChild(bookDiv);
}

function makeRequest() {
    request.open('GET', url + searchTerms + apiKey, true);
    request.onload = function () {
        console.log('i am in');
        data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.items.forEach(bookInfo => createBook(bookInfo));
        } else {
            console.log('error');
        }
    };
    request.send();
}

function fetchShelf(){
    if(localStorage.getItem('myShelf') != null){
        myShelf = localStorage.getItem('myShelf');
    }else{
      	localStorage.setItem('myShelf', '');
        myShelf = '';
    };
}

function addToShelf(title, author, publisher, img, url){
    fetchShelf();
    myShelf += `${title}; ${author}; ${publisher}; ${img}; ${url} / `;
  	localStorage.setItem('myShelf', myShelf);
}

function populateShelf(){
    fetchShelf();
    let bookArr = myShelf.split(' / ');
    bookArr.forEach(book => myShelfArr.push(book.split('; ')))
}



