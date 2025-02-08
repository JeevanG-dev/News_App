const categoreis = [
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

let currentCategory = "business";
let currentPage = 1;
let pageSize = 12;
let isloading = false;
let apiKey = "ec5e0ad87f3f445f9c9321b119bb69b3";
let searchQuery = "";

const navDrawer = document.getElementById("nav-drawer");
const navBar = document.getElementById("nav-bar");
const drawerBar = document.getElementById("drawer-bar");
const toggleMode = document.getElementById("toggle-mode");
const newsContainer = document.getElementById("news-container");
const errorDiv = document.getElementById("error");
const menuBtn = document.getElementById("menu-btn");
const closeDrawerBtn = document.getElementById("close-drawer-btn");
const searchInput = document.getElementById("search-input");

toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleMode.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";
});

menuBtn.addEventListener("click", () => {
  navDrawer.classList.toggle("show");
});

closeDrawerBtn.addEventListener("click", () => {
  navDrawer.classList.remove("show");
});

let debounceTimer;

function debounce(fun, delay) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fun(...args);
      console.log(...args);
      
    }, delay);
  };
}

searchInput.addEventListener(       
  "input",                          
  debounce((e) => {                 
    searchQuery = e.target.value;  
    currentPage = 1;                
    newsContainer.innerHTML = "";   

    fatchNews();
  },1000));

async function fatchNews() {
  if (isloading) return;
  isloading = true;
  errorDiv.classList.add("hidden");

  try {
    const queryParam =
      searchQuery.length > 0
        ? `&q=${searchQuery}`
        : `&category=${currentCategory}`;

    const respone = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&page=${currentPage}&pageSize=${pageSize}${queryParam}&apikey=${apiKey}`
    );
    const data = await respone.json();
    displayNews(data.articles);
    currentPage++;
    navDrawer.classList.remove("show");
  } catch (error) {
    errorDiv.classList.remove("hidden");
  } finally {
    isloading = false;
  }
}

//fetch on scroll..

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    fatchNews();
  }
});

function displayNews(article) {
  article.forEach((article) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("newsItem");
    newsItem.innerHTML = `
        <img src= "${article.urlToImage || "default.jpg"}" alt="Image"/>
        <div class="content">
        <h2>${article.title}</h2>
        <p>${article.description || "No News found yet"}</p>
        <a href="${article.url}" target="_blank">Read more..</a>
        
        </div>
        `;
    newsContainer.appendChild(newsItem);
  });
}

function createCatergoryElements(parent) {
  categoreis.forEach((category) => {
    let navItem = document.createElement("div");
    navItem.classList.add("nav-item");
    navItem.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    navItem.addEventListener("click", () => {
      currentCategory = category;
      currentPage = 1;
      newsContainer.innerHTML = "";
      fatchNews();
    });
    parent.appendChild(navItem);
  });
}
createCatergoryElements(navBar);
createCatergoryElements(drawerBar);

fatchNews();
