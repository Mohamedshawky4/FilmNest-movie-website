import { fetchData } from './modules/package.js';
const slides = document.querySelectorAll('.movies-slide');
const API_KEY = 'd19037208bd280bfc77a999c95b34789'; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const languageSelector = document.querySelector('#languageSelector');
const languageSelectorM = document.querySelector('#languageSelectorM');
let language = localStorage.getItem('selectedLanguage') || 'en';
let mainslide=document.querySelector('.main-slider');

  //mini slides arrows
function slideshow(slides) {
  slides.forEach(slide => {
    const rightArrow = slide.closest('.container').querySelector('.right-arrow');
    const leftArrow = slide.closest('.container').querySelector('.leftarrow');
    let index = 0;
    const items = slide.children;
    const totalItems = items.length;
    // console.log(totalItems);
    
    const itemWidth = `200` ;
     const visibleItems = Math.floor(slide.offsetWidth / itemWidth);
    rightArrow.addEventListener('click', () => {
      slide.scrollBy({
        left: 205, 
        behavior: 'smooth' 
      });
    });

    leftArrow.addEventListener('click', () => {
      slide.scrollBy({
        left: -205, 
        behavior: 'smooth' 
      });
    });
 
  });
}
  
  const loadSliders = async () => {
    const topRatedMovies = await fetchData('top_rated', 'movie', language);
  const popularMovies = await fetchData('popular', 'movie', language);
  const topRatedSeries = await fetchData('top_rated', 'tv', language);
  const popularSeries = await fetchData('popular', 'tv', language);
  
    // Display the results in your sliders
    displaySlider('toprated-movies', topRatedMovies);
    displaySlider('popular-movies', popularMovies);
    displaySlider('toprated-series', topRatedSeries);
    displaySlider('popular-series', popularSeries);
  };
 
  const displaySlider = (category, data) => {
    let sliderContainer = document.getElementById(`${category}`);
    sliderContainer.innerHTML = '';

    if(category=="toprated-movies" || category=="popular-movies"){
      data.slice(0,2).forEach(item => {
        let card=`<div class="main-slide-item movie">
                      <img src="https://image.tmdb.org/t/p/w500/${item.backdrop_path}" alt="">
                      <div class="overlay"></div>
                      <div class="main-slide-item-content">
                          <div class="item-content-wraper">
                              <div class="item-content-title top-down">
                                  ${item.title}
                              </div>
                              <div class="movie-infos top-down delay-2">
                                  <div class="movie-info">
                                      <span >${item.vote_average} <i class="fa-solid fa-star"></i></span>
                                      
                                  </div> 
                              </div>
                              <div class="item-content-description top-down delay-4">
                                  ${item.overview}
                              </div>
                              <div class="item-action top-down delay-6">
                                  <a href="./htmlpages/moviedetail.html?id=${item.id}" class="btn btn-hover">
                                      
                                      <span>Watch now</span>
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>`;
                  mainslide.innerHTML += card;
      });
     // Add each item to the slider
    data.forEach(item => {
      console.log(item);
      const movieitem=`<a href="./htmlpages/moviedetail.html?id=${item.id}" class="movie-item movie">
      <i class="fa-regular fa-bookmark list-icon"></i>
      <i class="fa-regular fa-heart fav-icon"></i>
      <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title}">
      <div class="movie-item-content">
          <div class="movie-item-title">
              ${item.title}
          </div>
          <div class="movie-infos">
              <div class="movie-info">
                  <i class=></i>
                  <span>${item.vote_average}<i class="fa-solid fa-star"></i></span>
              </div>
              <div class="movie-info">
                  <i class=></i>
                  <span>${item.release_date}  </span>
              </div>
             
          </div>
      </div>
  </a>`;
    sliderContainer.innerHTML += movieitem;
  }); 
    }
    if (category=="toprated-series" || category=="popular-series") {
      data.slice(0,2).forEach(item => {
            const card=`<div class="main-slide-item tv">
                      <img src="https://image.tmdb.org/t/p/w500/${item.backdrop_path}" alt="">
                      <div class="overlay"></div>
                      <div class="main-slide-item-content">
                          <div class="item-content-wraper">
                              <div class="item-content-title top-down">
                                  ${item.name}
                              </div>
                              <div class="movie-infos top-down delay-2">
                                  <div class="movie-info">
                                      <span>${item.vote_average} <i class="fa-solid fa-star"></i></span>
                                  </div> 
                              </div>
                              <div class="item-content-description top-down delay-4">
                                  ${item.overview}
                              </div>
                              <div class="item-action top-down delay-6">
                                  <a href="./htmlpages/tvdetail.html?id=${item.id}" class="btn btn-hover">
                                      
                                      <span>Watch now</span>
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>`;
                      mainslide.innerHTML += card;
          });
       // Add each item to the slider
    data.forEach(item => {
      // console.log(item);
      
      // console.log(item);
      const movieitem=`<a href="./htmlpages/tvdetail.html?id=${item.id}" class="movie-item tv">
      <i class="fa-regular fa-bookmark list-icon"></i>
      <i class="fa-regular fa-heart fav-icon"></i>

      <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.name}">
      <div class="movie-item-content">
          <div class="movie-item-title">
              ${item.name}
          </div>
          <div class="movie-infos">
              <div class="movie-info">
                  <i class="bx bxs-star"></i>
                  <span>${item.vote_average}<i class="fa-solid fa-star"></i></span>
              </div>
              <div class="movie-info">
                  <i class="bx bxs-time"></i>
                  <span>${item.first_air_date} </span>
              </div>
          </div>
      </div>
  </a>`;
    sliderContainer.innerHTML += movieitem;
  }); 
      
    } 
let fav=document.querySelectorAll('.fav-icon');
let list=document.querySelectorAll('.list-icon');    
  };
  
  loadSliders();
     // toggle lang
  languageSelector.addEventListener('click', (event) => {
   language = event.target.textContent === 'English' ? 'en' : 'ar'; // Toggle between 'ar' and 'en'
   localStorage.setItem('selectedLanguage', language);
    
    event.target.textContent = language === 'en' ? 'Arabic' : 'English'; // Update button text
    mainSlider.innerHTML = '';  
    loadSliders();
    setTimeout(() => {
    
      restoreIcons(); 
    }, 250);


    
});
languageSelectorM.addEventListener('click', (event) => {
  language = event.target.textContent === 'English' ? 'en' : 'ar'; // Toggle between 'ar' and 'en'
  localStorage.setItem('selectedLanguage', language);
   
   event.target.textContent = language === 'en' ? 'Arabic' : 'English'; // Update button text
   mainSlider.innerHTML = '';  
   loadSliders();
   setTimeout(() => {
   
     restoreIcons(); 
   }, 250);


   
});
// Slider Elements
const sliderContainer = document.querySelector('.slider-container');
const mainSlider = document.querySelector('.main-slider');
let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
//main slider
function moveToSlide(index) {
  const mainslideitems = document.querySelectorAll('.main-slide-item');
    const totalSlides = mainslideitems.length;
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    mainSlider.style.transition = 'transform 0.5s ease-in-out';
    mainSlider.style.transform = `translateX(-${currentIndex * window.innerWidth}px)`;
    prevTranslate = -currentIndex * window.innerWidth;
}

// Handle Arrows
document.querySelector('.right-arrow').addEventListener('click', () => moveToSlide(currentIndex + 1));
document.querySelector('.leftarrow').addEventListener('click', () => moveToSlide(currentIndex - 1));
// Enable Arrow Keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') moveToSlide(currentIndex + 1);
    if (e.key === 'ArrowLeft') moveToSlide(currentIndex - 1);
});


let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
let liststorage = JSON.parse(localStorage.getItem('list')) || [];
function restoreIcons(){
  favstorage.forEach(item => {
    const favIcon = document.querySelector(`.movie-item.${item.kind}[href*="id=${item.id}"] .fav-icon`);
    if (favIcon && favIcon.classList.contains("fa-regular")) {
      favIcon.classList.replace("fa-regular", "fa-solid");
    }
  });
  
  // Restore Watchlist
  liststorage.forEach(item => {
    const listIcon = document.querySelector(`.movie-item.${item.kind}[href*="id=${item.id}"] .list-icon`);
    if (listIcon && listIcon.classList.contains("fa-regular")) {
      listIcon.classList.replace("fa-regular", "fa-solid");
    }
  });
}
document.addEventListener('click', (event) => {
  // Toggle for favorite icon
  if (event.target.classList.contains('fav-icon')) {
    event.preventDefault();
    event.stopPropagation();

    const parentMovieItem = event.target.closest('.movie-item');
    const id = new URLSearchParams(new URL(parentMovieItem.href).search).get('id');
    const kind = parentMovieItem.classList.contains('movie') ? 'movie' : 'tv';
    const data = { id: id, kind: kind };



    if (event.target.classList.contains("fa-regular")) {
      event.target.classList.remove("fa-regular");
      event.target.classList.add("fa-solid");
       if (!favstorage.some(item => item.id === data.id)) {
        favstorage.push(data);
        } // Add to favorites
    } else {
      event.target.classList.remove("fa-solid");
      event.target.classList.add("fa-regular");
      favstorage = favstorage.filter(item => item.id !== id); // Remove from favorites
    }

    localStorage.setItem('fav', JSON.stringify(favstorage)); // Save updated favorites
  }

  // Toggle for list icon
  if (event.target.classList.contains('list-icon')) {
    event.preventDefault();
    event.stopPropagation();

    const parentMovieItem = event.target.closest('.movie-item');
    const id = new URLSearchParams(new URL(parentMovieItem.href).search).get('id');
    const kind = parentMovieItem.classList.contains('movie') ? 'movie' : 'tv';
    const data = { id: id, kind: kind };
    if (event.target.classList.contains("fa-regular")) {
      event.target.classList.remove("fa-regular");
      event.target.classList.add("fa-solid");
      if (!liststorage.some(item => item.id === data.id)) {
        liststorage.push(data);
    } // Add to watchlist
    } else {
      event.target.classList.remove("fa-solid");
      event.target.classList.add("fa-regular");
      liststorage = liststorage.filter(item => item.id !== id); // Remove from watchlist
    }

    localStorage.setItem('list', JSON.stringify(liststorage)); // Save updated watchlist
  }
});
setTimeout(() => {
  slideshow(slides);
  restoreIcons(); 
}, 250);


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


