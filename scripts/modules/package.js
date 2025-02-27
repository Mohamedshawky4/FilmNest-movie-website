const API_KEY = 'd19037208bd280bfc77a999c95b34789'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

// General Fetch Function
export const fetchData = async (category, type, language = 'en', page = 1) => {
  try {
    const url = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&language=${language}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${category} ${type}:`, error);
    return [];
  }
};
// Fetch Movie/series Details
export async function details(id, type,  language, container) {
  let apiUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=d19037208bd280bfc77a999c95b34789&language=${language}`;
  
  try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const genres = data.genres.map(genre => genre.name).join(', ');
      
      const card = `  
      <div class="img-container movie-item" data-id="${data.id}" data-kind="${type}">
         <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title || data.name}">
      </div>
      <div class="p-container">
          <h1>${data.title || data.name}</h1>
          <div class="lists-contain">
          <div id="detail-list">
          <span class="icon-span" id="listtext">add to watchlist</span>
          <i class="fa-regular fa-bookmark list-icon"></i>
          </div> 
          <div id="detail-fav">
          <span class="icon-span" id="favtext">add to favourites</span>
          <i class="fa-regular fa-heart fav-icon"></i>
          </div>
          </div>
          <button class="trailer-btn" style="display:none;">Watch Trailer</button>
          <div class="trailer-popup">
              <div class="trailer-content">
                  <span class="close-btn">&times;</span>
                  <iframe id="trailer-video" frameborder="0" allowfullscreen></iframe>
              </div>
          </div>
          <p class="overview">${data.overview}</p>
          <p class="date">Date released: ${data.release_date || data.first_air_date}</p>
          <p class="rating">Rating: ${data.vote_average}/10</p>
          <p class="genres">Genres: ${genres}</p>
          <div class="related-container">
          <h2>Related ${type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
          <div class="related-movies"></div>
          </div>
      </div>`;

      container.innerHTML = card;

      restoreIcons(data.id, type);
      fetchRelated(data.id, type, API_KEY, language);
      fetchTrailer(data.id, type, API_KEY, language);
  } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
  }
}
//fetch movie or series cast
export async function fetchCast(id, type, language, castContainer) {
  let castUrl = `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=d19037208bd280bfc77a999c95b34789&language=${language}`;
  
  try {
      const response = await fetch(castUrl);
      const data = await response.json();
      displayCast(data.cast.slice(0, 10), castContainer);
  } catch (error) {
      console.error(`Error fetching ${type} cast:`, error);
  }
}
//display movie or series cast
export function displayCast(cast, castContainer) {
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
//fetch related movie or series
export async function fetchRelated(id, type, apiKey, language) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${apiKey}&language=${language}`);
      const data = await response.json();
      displayRelated(data.results.slice(0, 5), type);
  } catch (error) {
      console.error(`Error fetching related ${type}s:`, error);
  }
}
//display related movie or series
export function displayRelated(items, type) {
  const relatedContainer = document.querySelector('.related-movies');
  relatedContainer.innerHTML = '';
  items.forEach(item => {
      const card = `<div class="related-card">
          <a href="./${type}detail.html?id=${item.id}">
             <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title || item.name}">
             <div class="related-title">${item.title || item.name}</div>
          </a>
      </div>`;
      relatedContainer.innerHTML += card;
  });
}
//fetch movie or series trailer
export async function fetchTrailer(id, type, apiKey, language) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=${language}`);
      const data = await response.json();
      const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
      
      if (trailer) {
          const trailerBtn = document.querySelector('.trailer-btn');
          trailerBtn.style.display = 'block';
          trailerBtn.addEventListener('click', () => showTrailerPopup(trailer.key));
      }
  } catch (error) {
      console.error(`Error fetching ${type} trailer:`, error);
  }
}
//display movie or series trailer
function showTrailerPopup(videoKey) {
  const popup = document.querySelector('.trailer-popup');
  const iframe = document.getElementById('trailer-video');
  
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  popup.style.display = 'flex';  
  popup.style.visibility = 'visible';
  popup.style.opacity = '1';

  document.querySelector('.close-btn').addEventListener('click', () => {
      popup.style.display = 'none';
      iframe.src = "";
  });

  window.addEventListener('click', (event) => {
      if (event.target === popup) {
          popup.style.display = 'none';
          iframe.src = "";
      }
  });
}
//restore icons
function restoreIcons(id, type) {
  let favstorage = JSON.parse(localStorage.getItem('fav')) || [];
  let liststorage = JSON.parse(localStorage.getItem('list')) || [];

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

