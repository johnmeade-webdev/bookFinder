let resultShelf = document.querySelector('#result_shelf');

function createBook(book){
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

    bookDiv.appendChild(fav);

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = 'Title: ' + bookName;

    bookDiv.appendChild(title);

    let author = document.createElement('p');
    author.classList.add('author');
    author.innerText = 'By: ' + authorName;

    bookDiv.appendChild(author);
    
    let publisher = document.createElement('p');
    publisher.classList.add('publisher');
    publisher.innerText = publisherName;

    bookDiv.appendChild(publisher);
    resultShelf.appendChild(bookDiv);
}

let url = 'https://www.googleapis.com/books/v1/volumes?q=';
let searchTerms = 'harry_potter';
let apiKey = '&key=AIzaSyBqfUHvXPiHKcQc9KeWA7tVqT05-rHMWHM';
let data = {};


let request = new XMLHttpRequest();

request.open('GET', url + searchTerms + apiKey, true);
request.onload = function() {
    console.log('i am in');
    data = JSON.parse(this.response);
    if(request.status >= 200 && request.status < 400){
        data.items.forEach(bookInfo => createBook(bookInfo));
    } else {
        console.log('error');
    }
};

request.send();