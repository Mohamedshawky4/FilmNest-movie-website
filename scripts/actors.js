const apiKey = 'd19037208bd280bfc77a999c95b34789';  
const baseApiUrl = 'https://api.themoviedb.org/3';
let language = 'en';
const container = document.querySelector('.container');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
const languageSelector = document.querySelector('#languageSelector');

async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}
function displayMovies(movies) {
    container.innerHTML = '';
    movies.forEach(movie => {
        
        console.log(movie);
        let card = `<div class="card movie movie-item" data-id="${movie.id}" data-kind="movie">
            <a href="./actors-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.profile_path}" alt="${movie.name}">
                <h3>${movie.name}</h3>
            </a>
        </div>`;
            container.innerHTML += card;
    });
}

fetchMovies(`${baseApiUrl}/person/popular?&api_key=${apiKey}&language=${language}`);

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(`${baseApiUrl}/search/person?query=${query}&api_key=${apiKey}&language=${language}`);
    }
    else{
        fetchMovies(`${baseApiUrl}/person/popular?&api_key=${apiKey}&language=${language}`);

    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});
languageSelector.addEventListener('click', (event) => {
    let language = event.target.textContent === 'English' ? 'en' : 'ar'; // Toggle between 'ar' and 'en'
    
    event.target.textContent = language === 'en' ? 'Arabic' : 'English'; // Update button text
    


    // Fetch movies with the selected language
    fetchMovies(`${baseApiUrl}/person/popular?&api_key=${apiKey}&language=${language}`);
});
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
  
  


