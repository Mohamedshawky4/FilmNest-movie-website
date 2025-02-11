const id = location.search.split('=')[1];
const apiKey = 'd19037208bd280bfc77a999c95b34789';
let language = 'en';

const apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=${language}`;
const castUrl = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=${language}`;
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
    <div class="img-container">
       <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.name}">
    </div>
    <div class="p-container">
        <h1>${data.name}</h1>
        <p class="overview">${data.overview}</p>
        <p class="date">Date released: ${data.first_air_date}</p>
        <p class="rating">Rating: ${data.vote_average}/10</p>
        <p class="genres">Genres: ${genres}</p>
        <h2>Related Movies</h2> 
        <div class="related-movies"></div> <!-- Move this here -->
    </div>`;


    container.innerHTML = card;
    fetchRelatedMovies(data.id);
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
        const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/similar?api_key=${apiKey}&language=${language}`);
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
               <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.name}">
               <div class="related-title">${movie.name}</div>
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
  
  
