import { fetchContent, displayContent, renderPagination, fetchGenres, checkUserSession, handleAuth, fetchSearchResults } from './modules/movies-series-module.js';
let language = localStorage.getItem('selectedLanguage') || 'en';

const container = document.querySelector('.container');
const pagination = document.querySelector('.pagination');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
const logButton = document.getElementById('logBut');
const filterOptions = document.querySelector('.filter-options');
const sortOptions = document.getElementById('sortOptions');
const filterButton = document.getElementById('filterButton');
let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
let liststorage = JSON.parse(localStorage.getItem('list')) || [];
let currentPage = 1;
let totalPages = 1;
let currentGenre = '';
let currentSortOption = 'popularity.desc';
// 🟢 Fetch Movies with Pagination, Sorting, and Filtering
async function fetchMovies(page = 1) {
    const movies = await fetchContent('tv', page, currentGenre, currentSortOption,language);
    
    if (movies.results.length > 0) {
        totalPages = movies.total_pages; // ✅ Get total pages from API response
        currentPage = page; // ✅ Update current page
        displayContent(container, movies.results, 'tv');
        renderPagination(pagination, currentPage, totalPages, fetchMovies);
    }
}

// 🟢 Handle Search Functionality
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const movies = await fetchSearchResults('tv', query);
        displayContent(container, movies, 'tv');
    } else {
        fetchMovies(currentPage);
    }
});

// 🟢 Handle Sorting
sortOptions.addEventListener('change', async (event) => {
    currentSortOption = event.target.value;
    currentPage = 1; // Reset to first page when sorting changes
    await fetchMovies(currentPage);
});

// 🟢 Fetch Genres and Create Filter Buttons
async function setupGenres() {
    try {
        const genres = await fetchGenres('tv'); // Fetch genres from API

        if (!genres || genres.length === 0) {
            console.error("No genres found");
            return;
        }

        filterOptions.innerHTML = '<button id="0" class="genrebutton">ALL</button>';

        genres.forEach(genre => {
            filterOptions.innerHTML += `<button id="${genre.id}" class="genrebutton">${genre.name}</button>`;
        });

        // Add event listeners for genre buttons
        document.querySelectorAll('.genrebutton').forEach(button => {
            button.addEventListener('click', async () => {
                currentGenre = button.id === '0' ? '' : button.id;
                currentPage = 1; // Reset to first page when genre changes
                await fetchMovies(currentPage);
            });
        });

    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}
filterButton.addEventListener('click', () => {
    console.log("object");
    filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
});
languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    localStorage.setItem('selectedLanguage', language);
    
    fetchMovies(1);
});
languageSelectorM.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    localStorage.setItem('selectedLanguage', language);
    
    fetchMovies(1);
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
// 🟢 Initialize Everything
checkUserSession(logButton);
handleAuth(logButton);
setupGenres();
fetchMovies();

const menu = document.getElementById("menu-btn");
const nav = document.querySelector(".mobile-navbar"); // Correctly targets the <nav>

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
} else {
    console.error("Menu button or navigation bar not found!");
}



