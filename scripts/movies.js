const apiKey = 'd19037208bd280bfc77a999c95b34789';
const baseApiUrl = 'https://api.themoviedb.org/3';
let language = 'en';
const container = document.querySelector('.container');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
const languageSelector = document.querySelector('#languageSelector');
const filterButton = document.getElementById('filterButton');
const filterOptions = document.querySelector('.filter-options');
const sortoptions = document.getElementById('sortOptions');
const pagination = document.querySelector('.pagination');
let currentGenre = '';
let currentSortOption = 'popular';
let allMovies = [];
let currentPage = 1;
const moviesPerPage = 20;

let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
let liststorage = JSON.parse(localStorage.getItem('list')) || [];

async function fetchMovies() {
    allMovies = [];
    for (let page = 1; page <= 5; page++) {
        const url = `${baseApiUrl}/movie/${currentSortOption}?api_key=${apiKey}&language=${language}&page=${page}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }
    displayMovies(filterMoviesByGenre(allMovies));
}

function displayMovies(movies) {
    container.innerHTML = '';
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = movies.slice(start, end);

    paginatedMovies.forEach(movie => {
        let card = `<div class="card movie movie-item" data-id="${movie.id}" data-kind="movie">
            <a href="./moviedetail.html?id=${movie.id}">
                <i class="fa-regular fa-bookmark list-icon"></i>
                <i class="fa-regular fa-heart fav-icon"></i>
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            </a>
        </div>`;
        container.innerHTML += card;
    });

    restoreIcons();
    renderPagination(movies.length);
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
        const id = parentMovieItem.getAttribute('data-id');
        const kind = parentMovieItem.getAttribute('data-kind');
        const data = { id, kind };

        if (event.target.classList.contains('fav-icon')) {
            toggleStorage(event.target, favstorage, 'fav', data);
        } else if (event.target.classList.contains('list-icon')) {
            toggleStorage(event.target, liststorage, 'list', data);
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

function renderPagination(totalMovies) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalMovies / moviesPerPage);

    if (currentPage > 1) {
        pagination.innerHTML += '<button id="prevPage">Previous</button>';
    }

    pagination.innerHTML += `<span> Page ${currentPage} of ${totalPages} </span>`;

    if (currentPage < totalPages) {
        pagination.innerHTML += '<button id="nextPage">Next</button>';
    }

    document.getElementById('prevPage')?.addEventListener('click', () => {
        currentPage--;
        displayMovies(filterMoviesByGenre(allMovies));
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        currentPage++;
        displayMovies(filterMoviesByGenre(allMovies));
    });
}

function filterMoviesByGenre(movies) {
    if (currentGenre) {
        return movies.filter(movie => movie.genre_ids.includes(parseInt(currentGenre)));
    }
    return movies;
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    currentPage = 1;
    if (query) {
        fetchSearchResults(query);
    } else {
        fetchMovies();
    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    currentPage = 1;
    fetchMovies();
});

filterButton.addEventListener('click', () => {
    filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
});

async function fetchGenres() {
    try {
        const response = await fetch(`${baseApiUrl}/genre/movie/list?api_key=${apiKey}&language=${language}`);
        const data = await response.json();
        displayGenres(data.genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function displayGenres(genres) {
    filterOptions.innerHTML = '<button id="0" class="genrebutton">ALL</button>';
    genres.forEach(genre => {
        filterOptions.innerHTML += `<button id="${genre.id}" class="genrebutton">${genre.name}</button>`;
    });
    document.querySelectorAll('.genrebutton').forEach(button => {
        button.addEventListener('click', () => {
            currentGenre = button.id;
            if (currentGenre === '0') {
                currentGenre = ''; // Reset the genre filter
             currentPage = 1;
            displayMovies(filterMoviesByGenre(allMovies));}
           
            
            else{
            currentPage = 1;
            displayMovies(filterMoviesByGenre(allMovies));
        }
        });
    });
}

sortoptions.addEventListener('change', () => {
    currentSortOption = sortoptions.value;
    currentPage = 1;
    fetchMovies();
});

async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${baseApiUrl}/search/movie?query=${query}&api_key=${apiKey}&language=${language}`);
        const data = await response.json();
        displayMovies(filterMoviesByGenre(data.results));
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

fetchGenres();
fetchMovies();
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
  