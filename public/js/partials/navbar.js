const navToggler = document.querySelector('.nav-toggler');
const navbarList = document.querySelector('.navbar__list');

navToggler.addEventListener('click', () => {
    navbarList.classList.toggle('active')
})