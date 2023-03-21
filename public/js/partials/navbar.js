/* global toggleThemeLocalStorage toggleRootClass isDarkMode */
const navbar = document.querySelector('.navbar');
const navToggler = document.querySelector('.nav-toggler');
const navbarList = document.querySelector('.navbar__list');
const navbarThemeBtn = document.querySelector('.navbar__theme-btn');

navToggler.addEventListener('click', () => {
  navbarList.classList.toggle('active');
});

const toggleThemeBtn = () => {
  navbarThemeBtn.classList.toggle('fa-sun');
  navbarThemeBtn.classList.toggle('fa-moon');
};

navbarThemeBtn.addEventListener('click', () => {
  toggleThemeLocalStorage();
  toggleThemeBtn();
  toggleRootClass();
});

isDarkMode() ? toggleThemeBtn() : null;
