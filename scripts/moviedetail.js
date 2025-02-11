const id = location.search.split('=')[1];
const apiKey = 'd19037208bd280bfc77a999c95b34789';
let language = 'en';

let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
let liststorage = JSON.parse(localStorage.getItem('list')) || [];

const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${language}`;
const castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=${language}`;
const container = document.querySelector('.container2');
const castContainer = document.querySelector('.cast-container');

const languageSelector = document.querySelector('#languageSelector');

async function details(url) {
    const response = await fetch(url);
    const data = await response.json();

    const genres = data.genres.map(genre => genre.name).join(', ');
    const production = data.production_companies.map(company => company.name).join(', ');
    console.log(data);
    
    const card = `  
    <div class="img-container movie-item" data-id="${data.id}" data-kind="movie">
       <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title}">
    </div>
    <div class="p-container">
        <h1>${data.title}</h1>
        <span class="icon-span">add to watchlist</span>
        <i class="fa-regular fa-bookmark list-icon"></i>
        <span class="icon-span">add to favourites</span>
        <i class="fa-regular fa-heart fav-icon"></i>
        <p class="overview">${data.overview}</p>
        <p class="date">Date released: ${data.release_date}</p>
        <p class="rating">Rating: ${data.vote_average}/10</p>
        <p class="genres">Genres: ${genres}</p>
        <h2>Related Movies</h2> 
        <div class="related-movies"></div>
    </div>`;

    container.innerHTML = card;
    restoreIcons();
    fetchRelatedMovies(data.id);
}

function restoreIcons() {
    favstorage.forEach(item => {
        const favIcon = document.querySelector(`.movie-item[data-id="${item.id}"] .fav-icon`);
        if (favIcon && favIcon.classList.contains("fa-regular")) {
            favIcon.classList.replace("fa-regular", "fa-solid");
        }
    });

    liststorage.forEach(item => {
        const listIcon = document.querySelector(`.movie-item[data-id="${item.id}"] .list-icon`);
        if (listIcon && listIcon.classList.contains("fa-regular")) {
            listIcon.classList.replace("fa-regular", "fa-solid");
        }
    });
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fav-icon') || event.target.classList.contains('list-icon')) {
        event.preventDefault();
        event.stopPropagation();

        const parentMovieItem = event.target.closest('.movie-item');
         
        kind ="movie";
        const data = { id, kind };

        if (event.target.classList.contains('fav-icon')) {
            favstorage = toggleStorage(event.target, favstorage, 'fav', data);
        } else if (event.target.classList.contains('list-icon')) {
            liststorage = toggleStorage(event.target, liststorage, 'list', data);
        }
    }
});

function toggleStorage(icon, storage, key, data) {
    if (icon.classList.contains("fa-regular")) {
        icon.classList.replace("fa-regular", "fa-solid");
        if (!storage.some(item => item.id === data.id)) {
            storage.push(data);
        }
    } else {
        icon.classList.replace("fa-solid", "fa-regular");
        storage = storage.filter(item => item.id !== data.id);
    }
    localStorage.setItem(key, JSON.stringify(storage));
    return storage;
}

async function cast(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayCast(data.cast.slice(0, 10));
    } catch (error) {
        console.error('Error fetching cast:', error);
    }   
}

function displayCast(cast) {
    castContainer.innerHTML = '';
    cast.forEach(actor => {
        const card = `<div class="card">
            <a href="./moviedetail.html?id=${actor.id}">
               <img src="https://image.tmdb.org/t/p/w500/${actor.profile_path}" alt="${actor.name}">
               <div class="actorname">${actor.name}</div>
            </a>
        </div>`;
        castContainer.innerHTML += card;
    });
}

async function fetchRelatedMovies(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=${language}`);
        const data = await response.json();
          displayRelatedMovies(data.results.slice(0, 5));
    } catch (error) {
        console.error('Error fetching related movies:', error);
    }
}

function displayRelatedMovies(movies) {
    const relatedContainer = document.querySelector('.related-movies');
    relatedContainer.innerHTML = '';
    movies.forEach(movie => {
        const card = `<div class="related-card">
            <a href="./moviedetail.html?id=${movie.id}">
               <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
               <div class="related-title">${movie.title}</div>
            </a>
        </div>`;
        relatedContainer.innerHTML += card;
    });
}

const rightArrow = document.querySelector('.right-arrow');
const leftArrow = document.querySelector('.leftarrow');
let scrollAmount = 0;
const scrollStep = 210; 

rightArrow.addEventListener('click', () => {
    castContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

leftArrow.addEventListener('click', () => {
    castContainer.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});

languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    details(apiUrl);
    cast(castUrl);
});

details(apiUrl);
cast(castUrl);
function checkUserSession() {
    const user = sessionStorage.getItem('userEmail');
    const pass = sessionStorage.getItem('userPassword');
    let logbut= document.getElementById('logBut');
    if (user && pass) {
      console.log('User is logged in:', user);
      
      logbut.innerText = 'Logout';
      return true;
    } else{
      logbut.innerText = 'Login';
      return false;
    }
  }
  checkUserSession();
  let logBut=document.getElementById('logBut');
  logBut.addEventListener('click', () => {
    if(logBut.innerText === 'Logout'){
      console.log("object");
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userPassword');
      window.location.reload();
    }
  })
  
  
