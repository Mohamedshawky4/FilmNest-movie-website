const apiKey = 'd19037208bd280bfc77a999c95b34789';  
const baseApiUrl = 'https://api.themoviedb.org/3';
let language = localStorage.getItem('selectedLanguage') || 'en';

const container = document.querySelector('.container');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
const languageSelector = document.querySelector('#languageSelector');
const languageSelectorM = document.querySelector('#languageSelectorM');
const pagination = document.querySelector('.pagination');

let currentPage = 1;
let totalPages = 1;

async function fetchMovies(page = 1) {
    try {
        const response = await fetch(`${baseApiUrl}/person/popular?api_key=${apiKey}&language=${language}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        currentPage = page;
        console.log(data.results);
        displayMovies(data.results);
        renderPagination();
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    container.innerHTML = '';
    movies.forEach(movie => {
        let card = `<div class="card movie movie-item" data-id="${movie.id}" data-kind="movie">
            <a href="./actors-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.profile_path}" alt="${movie.name}">
                <h3>${movie.name}</h3>
            </a>
        </div>`;
        container.innerHTML += card;
    });
}

function renderPagination() {
    pagination.innerHTML = '';

    if (currentPage > 1) {
        pagination.innerHTML += `<button id="prevPage">Previous</button>`;
    }

    pagination.innerHTML += `<span> Page ${currentPage} of ${totalPages} </span>`;

    if (currentPage < totalPages) {
        pagination.innerHTML += `<button id="nextPage">Next</button>`;
    }

    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchMovies(currentPage - 1);
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchMovies(currentPage + 1);
        }
    });
}

fetchMovies();

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(1);
    } else {
        fetchMovies(currentPage);
    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    localStorage.setItem('selectedLanguage', language);
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    fetchMovies(currentPage);
});
languageSelectorM.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    localStorage.setItem('selectedLanguage', language);
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    fetchMovies(currentPage);
});

function checkUserSession() {
    const user = sessionStorage.getItem('userEmail');
    const pass = sessionStorage.getItem('userPassword');
    let logbut = document.getElementById('logBut');
    if (user && pass) {
        logbut.innerText = 'Logout';
        return true;
    } else {
        logbut.innerText = 'Login';
        return false;
    }
}
checkUserSession();

let logBut = document.getElementById('logBut');
logBut.addEventListener('click', () => {
    if (logBut.innerText === 'Logout') {
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userPassword');
        window.location.reload();
    }
});

const menu = document.getElementById("menu-btn");
const nav = document.querySelector(".mobile-navbar");
if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
} else {
    console.error("Menu button or navigation bar not found!");
}
