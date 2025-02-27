import { details ,fetchCast,toggleStorage} from './modules/package.js';
const id = location.search.split('=')[1];
const apiKey = 'd19037208bd280bfc77a999c95b34789';
let language = localStorage.getItem('selectedLanguage') || 'en';

let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
let liststorage = JSON.parse(localStorage.getItem('list')) || [];
let apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=${language}`;
let castUrl = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=${language}`;
let container = document.querySelector('.container2');
let castContainer = document.querySelector('.cast-container');

const languageSelector = document.querySelector('#languageSelector');


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
    localStorage.setItem('selectedLanguage', language);
    apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${language}`;
    details(id,"tv",language,container);
    castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=${language}`;
    fetchCast(id,"tv",language,castContainer);
});
languageSelectorM.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    localStorage.setItem('selectedLanguage', language);
    
    fetchMovies(1);
});

details(id,"tv",language,container);
fetchCast(id,"tv",language,castContainer);
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

  const menu = document.getElementById("menu-btn");
const nav = document.querySelector(".mobile-navbar"); // Correctly targets the <nav>

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
} else {
    console.error("Menu button or navigation bar not found!");
}


function Updateicons(id,favstorage,liststorage){
    console.log("object");
    if(favstorage.some(item => item.id === id)){
        let favIcon = document.querySelector(".fav-icon");
        favIcon.classList.replace("fa-regular", "fa-solid");
        let favtext= document.getElementById("favtext");
        favtext.innerText="Remove from Favorites";
    }
    if(liststorage.some(item => item.id === id)){
        let favIcon = document.querySelector(".list-icon");
        favIcon.classList.replace("fa-regular", "fa-solid");
        let favtext= document.getElementById("listtext");
        favtext.innerText="Remove from WatchList";
    }

}


setTimeout(() => {
    Updateicons(id,favstorage,liststorage);
    let listel=document.getElementById("detail-list");
let favel=document.getElementById("detail-fav");
listel.addEventListener("click", () => {
    let listspan = listel.childNodes[1]; // Text
    let listicon = listel.childNodes[3]; // Icon

    const movieId = id; // Ensure your HTML has a `data-id` attribute
    let listStorage = JSON.parse(localStorage.getItem("list")) || [];

    // Check if the movie is in the list
    const index = listStorage.findIndex(item => item.id === movieId);

    if (index !== -1) {
        // Movie is in watchlist → Remove it
        listStorage.splice(index, 1);
        listicon.classList.replace("fa-solid", "fa-regular");
        listspan.innerText = "Add to Watchlist";
    } else {
        // Movie is NOT in watchlist → Add it
        listStorage.push({ id: movieId, kind: "tv" });
        listicon.classList.replace("fa-regular", "fa-solid");
        listspan.innerText = "Remove from Watchlist";
    }

    // Save the updated list back to localStorage
    localStorage.setItem("list", JSON.stringify(listStorage));
});
favel.addEventListener("click", () => {
    let favspan = favel.childNodes[1]; // Text
    let favicon = favel.childNodes[3]; // Icon

    const movieId = id; // Ensure your HTML has a `data-id` attribute
    let favStorage = JSON.parse(localStorage.getItem("fav")) || [];

    // Check if the movie is in the list
    const index = favStorage.findIndex(item => item.id === movieId);

    if (index !== -1) {
        // Movie is in watchlist → Remove it
        favStorage.splice(index, 1);
        favicon.classList.replace("fa-solid", "fa-regular");
        favspan.innerText = "Add to Watchlist";
    } else {
        // Movie is NOT in watchlist → Add it
        favStorage.push({ id: movieId, kind: "tv" });
        favicon.classList.replace("fa-regular", "fa-solid");
        favspan.innerText = "Remove from Watchlist";
    }

    // Save the updated list back to localStorage
    localStorage.setItem("fav", JSON.stringify(favStorage));
});


}, 100);
  
  
