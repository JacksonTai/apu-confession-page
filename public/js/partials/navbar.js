const navbar = document.querySelector('.navbar')
const navToggler = document.querySelector('.nav-toggler');
const navbarList = document.querySelector('.navbar__list');

navToggler.addEventListener('click', () => {
    navbarList.classList.toggle('active')
})

const navbarThemeBtn = document.querySelector('.navbar__theme-btn')
navbarThemeBtn.addEventListener('click', () => {
    toggleThemeLocalStorage()
    toggleThemeBtn()
    toggleRootClass()
})

const toggleThemeBtn = () => {
    navbarThemeBtn.classList.toggle('fa-sun')
    navbarThemeBtn.classList.toggle('fa-moon')
}

isDarkMode() ? toggleThemeBtn() : null;