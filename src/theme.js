import { ref } from 'vue';

const isHighContrast = ref(false);

const toggleTheme = () => {
  isHighContrast.value = !isHighContrast.value;
  localStorage.setItem('highContrast', isHighContrast.value);
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('highContrast');
  if (savedTheme !== null) {
    isHighContrast.value = savedTheme === 'true';
  }
};

export { isHighContrast, toggleTheme, initializeTheme };