const apiKey = 'd19037208bd280bfc77a999c95b34789';
const baseApiUrl = 'https://api.themoviedb.org/3';
let language = 'en';
const languageSelector = document.querySelector('#languageSelector');
let listslider = document.getElementById('list');
let favslider = document.getElementById('fav');
let liststorage = JSON.parse(localStorage.getItem('list')) || [];
let favstorage = JSON.parse(localStorage.getItem('fav')) || [];

liststorage.forEach((movie) => {
    fetchMovieDetails(movie.id, movie.kind, "list");
});

favstorage.forEach((movie) => {
    fetchMovieDetails(movie.id, movie.kind, "fav");
});

async function fetchMovieDetails(id, kind, type) {
    const url = `${baseApiUrl}/${kind}/${id}?api_key=${apiKey}&language=${language}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (kind === 'movie') {
            displayMovie(data, type);
        } else if (kind === 'tv') {
            displayShow(data, type);
        }
        setTimeout(() => arrowvisibility("list"), 50);
        setTimeout(() => arrowvisibility("fav"), 50);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayMovie(item, type) {
    let sliderContainer = document.getElementById(type);
    const movieitem = `<a href="./htmlpages/moviedetail.html?id=${item.id}" class="movie-item movie" data-id="${item.id}" data-kind="movie">
        <i class="fa-regular fa-bookmark list-icon"></i>
        <i class="fa-regular fa-heart fav-icon"></i>
        <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title}">
        <div class="movie-item-content">
            <div class="movie-item-title">${item.title}</div>
            <div class="movie-infos">
                <div class="movie-info">
                    <span>${item.vote_average}<i class="fa-solid fa-star"></i></span>
                </div>
                <div class="movie-info">
                    <span>${item.release_date}</span>
                </div>
            </div>
        </div>
    </a>`;
    sliderContainer.innerHTML += movieitem;
}

function displayShow(item, type) {
    let sliderContainer = document.getElementById(type);
    const movieitem = `<a href="./htmlpages/tv-showsdetails.html?id=${item.id}" class="movie-item tv" data-id="${item.id}" data-kind="tv">
        <i class="fa-regular fa-bookmark list-icon"></i>
        <i class="fa-regular fa-heart fav-icon"></i>
        <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.name}">
        <div class="movie-item-content">
            <div class="movie-item-title">${item.name}</div>
            <div class="movie-infos">
                <div class="movie-info">
                    <span>${item.vote_average}<i class="fa-solid fa-star"></i></span>
                </div>
                <div class="movie-info">
                    <span>${item.first_air_date}</span>
                </div>
            </div>
        </div>
    </a>`;
    sliderContainer.innerHTML += movieitem;
}

languageSelector.addEventListener('click', (event) => {
    language = event.target.textContent === 'English' ? 'en' : 'ar';
    event.target.textContent = language === 'en' ? 'Arabic' : 'English';
    listslider.innerHTML = '';
    favslider.innerHTML = '';
    liststorage.forEach((movie) => {
        fetchMovieDetails(movie.id, movie.kind, "list");
    });
    favstorage.forEach((movie) => {
        fetchMovieDetails(movie.id, movie.kind, "fav");
    });
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fav-icon') || event.target.classList.contains('list-icon')) {
        event.preventDefault();
        event.stopPropagation();

        const parentMovieItem = event.target.closest('.movie-item');
        const id = parentMovieItem.dataset.id;
        const kind = parentMovieItem.dataset.kind;
        const data = { id, kind };

        if (event.target.classList.contains('fav-icon')) {
            favstorage = toggleFav(event.target, favstorage, 'fav', data);
        } else if (event.target.classList.contains('list-icon')) {
            liststorage = toggleList(event.target, liststorage, 'list', data);
        }
    }
});
function arrowvisibility(type) {
    let slide=document.getElementById(type);
    const rightArrow = slide.closest('.container').querySelector('.right-arrow');
    const leftArrow = slide.closest('.container').querySelector('.leftarrow');  
     const totalContentWidth = slide.scrollWidth;
  const visibleWidth = slide.clientWidth;
  console.log(totalContentWidth, visibleWidth);
  if (totalContentWidth <= visibleWidth) {
    rightArrow.style.display = 'none';
    leftArrow.style.display = 'none';
  } if (totalContentWidth > visibleWidth) {
    rightArrow.style.display = 'flex';
    leftArrow.style.display = 'flex';
  }}

function toggleFav(icon, storage, key, data) {
    if (icon.classList.contains("fa-regular")) {
        icon.classList.replace("fa-regular", "fa-solid");
        if (!storage.some(item => item.id === data.id)) {
            storage.push(data);
            if (!document.querySelector(`#fav .movie-item[data-id='${data.id}']`)) {
                fetchMovieDetails(data.id, data.kind, "fav");
                setTimeout(() => {
                    restoreIcons();
                }, 50); 

            }
           
        }
    } else {
        icon.classList.replace("fa-solid", "fa-regular");
        storage = storage.filter(item => item.id !== data.id);
        const itemToRemove = document.querySelector(`#fav .movie-item[data-id='${data.id}']`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    }
    localStorage.setItem(key, JSON.stringify(storage));
    arrowvisibility('fav');
    arrowvisibility('list');
    return storage;
}

function toggleList(icon, storage, key, data) {
    if (icon.classList.contains("fa-regular")) {
        icon.classList.replace("fa-regular", "fa-solid");
        if (!storage.some(item => item.id === data.id)) {
            storage.push(data);
            if (!document.querySelector(`#list .movie-item[data-id='${data.id}']`)) {
                fetchMovieDetails(data.id, data.kind, "list");
                setTimeout(() => {
                    restoreIcons();
                }, 50);
            }
        }
    } else {
        icon.classList.replace("fa-solid", "fa-regular");
        storage = storage.filter(item => item.id !== data.id);
        const itemToRemove = document.querySelector(`#list .movie-item[data-id='${data.id}']`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    }
    localStorage.setItem(key, JSON.stringify(storage));
    arrowvisibility('list');
    arrowvisibility('fav');
    return storage;
}



function restoreIcons() {
    favstorage.forEach(item => {
        const icons = document.querySelectorAll(`.movie-item[data-id='${item.id}'] .fav-icon`);
        icons.forEach(icon => {
            if (icon && icon.classList.contains("fa-regular")) {
                icon.classList.replace("fa-regular", "fa-solid");
            }   
        })
       
    });

    liststorage.forEach(item => {
        const icons = document.querySelectorAll(`.movie-item[data-id='${item.id}'] .list-icon`);
        icons.forEach(icon => {
            if (icon && icon.classList.contains("fa-regular")) {
                icon.classList.replace("fa-regular", "fa-solid");
            }   
        })
    });
       
}

function initializeSlider(type) {
    let slide = document.getElementById(type);
    console.log(slide);
    if (!slide) {
      console.log("error");
      return;
    } // Check if the slide exists
  
    const container = slide.closest('.container');
    const rightArrow = slide.closest('.container').querySelector('.right-arrow');
    const leftArrow = slide.closest('.container').querySelector('.leftarrow');  
    const itemWidth = 200;
    const scrollAmount = itemWidth + 5;
    console.log(rightArrow);
     const totalContentWidth = slide.scrollWidth;
  const visibleWidth = slide.clientWidth;

  if (totalContentWidth <= visibleWidth) {
    rightArrow.style.display = 'none';
    leftArrow.style.display = 'none';
  } else {
    rightArrow.style.display = 'flex';
    leftArrow.style.display = 'flex';
  }
    rightArrow.addEventListener('click', () => {
      console.log("Before Scroll (Right):", slide.scrollLeft);
      slide.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      console.log("After Scroll (Right):", slide.scrollLeft);
    });
  
    leftArrow.addEventListener('click', () => {
      console.log("Before Scroll (Left):", slide.scrollLeft);
      slide.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      console.log("After Scroll (Left):", slide.scrollLeft);
    });
  }
  
  setTimeout(() => {
    restoreIcons();
    initializeSlider("fav");
    initializeSlider("list");
  }, 300);
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
  
