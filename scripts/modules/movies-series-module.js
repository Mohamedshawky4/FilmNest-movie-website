export const apiKey = 'd19037208bd280bfc77a999c95b34789';
export const baseApiUrl = 'https://api.themoviedb.org/3';
export let language = localStorage.getItem('selectedLanguage') || 'en';

// Function to fetch movies or TV shows
export async function fetchContent(type, page = 1, genre = '', sort = 'popularity.desc',language) {
    const url = `${baseApiUrl}/discover/${type}?api_key=${apiKey}&language=${language}&sort_by=${sort}&vote_count.gte=500&page=${page}${genre ? `&with_genres=${genre}` : ''}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
    }
}

// Function to display movies or TV shows
export function displayContent(container, items, type) {
    container.innerHTML = '';
    items.forEach(item => {
        let card = `<div class="card ${type}-item" data-id="${item.id}" data-kind="${type}">
            <a href="./${type}detail.html?id=${item.id}">
                <i class="fa-regular fa-bookmark list-icon"></i>
                <i class="fa-regular fa-heart fav-icon"></i>
                <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title || item.name}">
                <h3>${item.title || item.name}</h3>
            </a>
        </div>`;
        container.innerHTML += card;
    });
    setTimeout(() => {
        restoreIcons(type);
    }, 100);
    
}

// Restore Favorites & Watchlist Icons
export function restoreIcons(type) {
    let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
    let liststorage = JSON.parse(localStorage.getItem('list')) || [];

    favstorage.forEach(item => {
        const favIcon = document.querySelector(`.${type}-item[data-id="${item.id}"] .fav-icon`);
        if (favIcon) favIcon.classList.replace("fa-regular", "fa-solid");
    });

    liststorage.forEach(item => {
        const listIcon = document.querySelector(`.${type}-item[data-id="${item.id}"] .list-icon`);
        if (listIcon) listIcon.classList.replace("fa-regular", "fa-solid");
    });
}

// Function to toggle favorites & watchlist
export function toggleStorage(icon, storage, key, data) {
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

// Function to handle pagination
export function renderPagination(pagination, currentPage, totalPages, fetchFunction) {
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
            fetchFunction(currentPage - 1);
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchFunction(currentPage + 1);
        }
    });
}


// Function to handle search
export async function fetchSearchResults(type, query) {
    try {
        const response = await fetch(`${baseApiUrl}/search/${type}?query=${query}&api_key=${apiKey}&language=${language}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`Error fetching search results for ${type}:`, error);
        return [];
    }
}

// Function to check user session
export function checkUserSession(logButton) {
    const user = sessionStorage.getItem('userEmail');
    const pass = sessionStorage.getItem('userPassword');

    if (user && pass) {
        logButton.innerText = 'Logout';
    } else {
        logButton.innerText = 'Login';
    }
}

// Function to handle login/logout
export function handleAuth(logButton) {
    logButton.addEventListener('click', () => {
        if (logButton.innerText === 'Logout') {
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('userPassword');
            window.location.reload();
        }
    });
}

// Function to fetch genres
export async function fetchGenres(type) {
    try {
        const response = await fetch(`${baseApiUrl}/genre/${type}/list?api_key=${apiKey}&language=${language}`);
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error(`Error fetching ${type} genres:`, error);
        return [];
    }
}

