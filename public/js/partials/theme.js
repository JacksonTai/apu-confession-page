/* global navbarThemeBtn */
const isDarkMode = () => {
  return localStorage.getItem('apucp-dark-mode');
};

const toggleThemeLocalStorage = () => {
  if (navbarThemeBtn.classList.contains('fa-moon')) {
    localStorage.removeItem('apucp-dark-mode');
  }
  if (navbarThemeBtn.classList.contains('fa-sun')) {
    localStorage.setItem('apucp-dark-mode', 'set');
  }
};

const toggleRootClass = () => {
  document.querySelector(':root').classList.toggle('dark');
};

isDarkMode() ? toggleRootClass() : null;
