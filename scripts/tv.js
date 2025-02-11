let language = 'en';
const apiKey = 'd19037208bd280bfc77a999c95b34789';  
const container = document.querySelector('.container');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
const languageSelector = document.querySelector('#languageSelector');
const filterButton = document.getElementById('filterButton');
const filterOptions = document.querySelector('.filter-options');
const sortOptions = document.getElementById('sortOptions');
const pagination = document.querySelector('.pagination');

let currentGenre = '';
let currentSortOption = 'popular';
let allShows = [];
let currentPage = 1;
const showsPerPage = 20;

let favStorage = JSON.parse(localStorage.getItem('fav')) || [];
let listStorage = JSON.parse(localStorage.getItem('list')) || [];

async function fetchShows() {
    allShows = [];
    for (let page = 1; page <= 5; page++) {
        let url = '';

        if (currentSortOption === 'top_rated' || currentSortOption === 'popular') {
            url = `https://api.themoviedb.org/3/tv/${currentSortOption}?api_key=${apiKey}&language=${language}&page=${page}`;
        } else {
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=${language}&sort_by=${currentSortOption}.desc&page=${page}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            allShows = allShows.concat(data.results);
        } catch (error) {
            console.error('Error fetching TV shows:', error);
        }
    }
    displayShows(filterShowsByGenre(allShows));
}

function displayShows(shows) {
    container.innerHTML = '';
    const start = (currentPage - 1) * showsPerPage;
    const end = start + showsPerPage;
    const paginatedShows = shows.slice(start, end);

    paginatedShows.forEach(show => {
        const posterPath = show.poster_path ? `https://image.tmdb.org/t/p/w500/${show.poster_path}` : 'placeholder.jpg';

        const card = `
            <div class="card tv-show-item" data-id="${show.id}" data-kind="tv">
                <a href="./tv-showsdetails.html?id=${show.id}">
                    <i class="fa-regular fa-bookmark list-icon"></i>
                    <i class="fa-regular fa-heart fav-icon"></i>
                    <img src="${posterPath}" alt="${show.name || show.original_name}">
                    <h3>${show.name || show.original_name}</h3>
                </a>
            </div>`;

        container.innerHTML += card;
    });

    restoreIcons();
    renderPagination(shows.length);
}

function restoreIcons() {
    favStorage.forEach(item => {
        const favIcon = document.querySelector(`.tv-show-item[data-id="${item.id}"] .fav-icon`);
        if (favIcon && favIcon.classList.contains("fa-regular")) {
            favIcon.classList.replace("fa-regular", "fa-solid");
        }
    });

    listStorage.forEach(item => {
        const listIcon = document.querySelector(`.tv-show-item[data-id="${item.id}"] .list-icon`);
        if (listIcon && listIcon.classList.contains("fa-regular")) {
            listIcon.classList.replace("fa-regular", "fa-solid");
        }
    });
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fav-icon') || event.target.classList.contains('list-icon')) {
        event.preventDefault();
        event.stopPropagation();

        const parentShowItem = event.target.closest('.tv-show-item');
        const id = parentShowItem.getAttribute('data-id');
        const kind = parentShowItem.getAttribute('data-kind');
        const data = { id, kind };

        if (event.target.classList.contains('fav-icon')) {
            toggleStorage(event.target, favStorage, 'fav', data);
        } else if (event.target.classList.contains('list-icon')) {
            toggleStorage(event.target, listStorage, 'list', data);
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

function renderPagination(totalShows) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalShows / showsPerPage);

    if (currentPage > 1) {
        pagination.innerHTML += '<button id="prevPage">Previous</button>';
    }

    pagination.innerHTML += `<span> Page ${currentPage} of ${totalPages} </span>`;

    if (currentPage < totalPages) {
        pagination.innerHTML += '<button id="nextPage">Next</button>';
    }

    document.getElementById('prevPage')?.addEventListener('click', () => {
        currentPage--;
        displayShows(filterShowsByGenre(allShows));
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        currentPage++;
        displayShows(filterShowsByGenre(allShows));
    });
}

function filterShowsByGenre(shows) {
    if (currentGenre) {
        return shows.filter(show => show.genre_ids.includes(parseInt(currentGenre)));
    }
    return shows;
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    currentPage = 1;
    if (query) {
        fetchSearchResults(query);
    } else {
        fetchShows();
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
    fetchShows();
});

filterButton.addEventListener('click', () => {
    filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
});

async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=${language}`);
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
                currentGenre = '';
            }
            currentPage = 1;
            displayShows(filterShowsByGenre(allShows));
        });
    });
}

sortOptions.addEventListener('change', () => {
    currentSortOption = sortOptions.value;
    currentPage = 1;
    fetchShows();
});

async function fetchSearchResults(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${apiKey}&language=${language}`);
        const data = await response.json();
        displayShows(filterShowsByGenre(data.results));
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

fetchGenres();
fetchShows();function checkUserSession() {
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
  
  