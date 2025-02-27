const id = location.search.split('=')[1];
const apiKey = 'd19037208bd280bfc77a999c95b34789';
let language = localStorage.getItem('selectedLanguage') || 'en';


let apiUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=${language}`;
let topWorksUrl = `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=${language}`;

const container = document.querySelector('.container2');

const languageSelector = document.querySelector('#languageSelector');
const languageSelectorM = document.querySelector('#languageSelectorM');

async function details(url) {
    let response = await fetch(url);
    const data = await response.json();
    console.log(data);
    container.innerHTML = '';
    
    const card = `  
    <div class="img-container movie-item" data-id="${data.id}" data-kind="movie">
       <img src="https://image.tmdb.org/t/p/w500/${data.profile_path}" alt="${data.name}">
    </div>
    <div class="p-container">
        <h1>${data.name}</h1>
        <p class="overview">${data.biography}</p>
        <p class="date">Birthday: ${data.birthday}</p>
        <p class="place">Place of Birth: ${data.place_of_birth}</p>
        <h2>Top Works</h2> 
        <div class="related-movies"></div>
    </div>`;

    container.innerHTML = card;
    fetchTopWorks(topWorksUrl);
}

details(apiUrl);

async function fetchTopWorks(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const topWorks = data.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
        displayTopWorks(topWorks);
    } catch (error) {
        console.error('Error fetching top works:', error);
    }
}

function displayTopWorks(works) {
    const topWorksContainer = document.querySelector('.related-movies');
    topWorksContainer.innerHTML = '';
    works.forEach(work => {
        console.log(work);
        let detailPage = work.media_type === 'movie' ? 'moviedetail.html' : 'tvdetail.html'; 
        let card = `<div class="related-card">
            <a href="./${detailPage}?id=${work.id}">
               <img src="https://image.tmdb.org/t/p/w500/${work.poster_path || work.profile_path}" alt="${work.title || work.name}">
               <div class="related-title">${work.title || work.name}</div>
            </a>
        </div>`;
        topWorksContainer.innerHTML += card;
    });
}

function checkUserSession() {
    const user = sessionStorage.getItem('userEmail');
    const pass = sessionStorage.getItem('userPassword');
    let logbut = document.getElementById('logBut');
    if (user && pass) {
      console.log('User is logged in:', user);
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
        console.log("Logging out...");
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userPassword');
        window.location.reload();
    }
});
const menu = document.getElementById("menu-btn");
const nav = document.querySelector(".mobile-navbar"); // Correctly targets the <nav>

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
} else {
    console.error("Menu button or navigation bar not found!");
}
languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    localStorage.setItem('selectedLanguage', language);
    apiUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=${language}`;
    details(apiUrl);
    topWorksUrl = `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=${language}`;
    fetchTopWorks(topWorksUrl);
    
});
languageSelectorM.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    localStorage.setItem('selectedLanguage', language);
    apiUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=${language}`;
    details(apiUrl);
    topWorksUrl = `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=${language}`;
    fetchTopWorks(topWorksUrl);
    
});

