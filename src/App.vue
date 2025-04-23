<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { provide, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "App",
  setup() {
    const isHighContrast = ref(false);

    const toggleTheme = () => {
      isHighContrast.value = !isHighContrast.value;
      localStorage.setItem("highContrast", isHighContrast.value);
      document.documentElement.classList.toggle(
        "high-contrast",
        isHighContrast.value
      );
    };

    provide("isHighContrast", isHighContrast);
    provide("toggleTheme", toggleTheme);

    onMounted(() => {
      const savedTheme = localStorage.getItem("highContrast");
      if (savedTheme !== null) {
        isHighContrast.value = savedTheme === "true";
        document.documentElement.classList.toggle(
          "high-contrast",
          isHighContrast.value
        );
      }
    });

    return {};
  },
};
</script>

<style>
:root {
  /* Keep all your existing light mode variables */
  --primary-color: #003366;
  --brat: #fff;
  --secondary-color: #ffd100;
  --background-color: #f4f7fc;
  --text-color: #000;
  --button-bg-color: #ffd100;
  --button-text-color: #003366;
  --header-bg-color: #003366;
  --header-text-color: #fff;
  --card-bg-color: #fff;
  --card-border-color: #ddd;
  --badge-bg-color: #e2e3e5;
  --badge-text-color: #383d41;
  --text-shadow-color: rgba(0, 0, 0, 0.3);
  --filter-bg-color: #f8f9fa;
  --filter-border-color: #ddd;
  --input-group-text-color: #fff;
  --badge-en-proceso-text-color: #856404;
  --badge-finalizada-bg-color: #d4edda;
  --badge-finalizada-text-color: #155724;
  --badge-cancelada-rechazada-bg-color: #f8d7da;
  --badge-cancelada-rechazada-text-color: #721c24;
  --badge-otro-estado-bg-color: #dee2e6;
  --badge-otro-estado-text-color: #495057;
  --modal-btn-bg-color: #ffd100;
  --sm-text: #666; /* Added missing variable */
}

.high-contrast {
  /* Dark mode variables - only updating colors */
  --primary-color: #0a2240;
  --brat: #84cf00;
  --secondary-color: #d4a017;
  --background-color: #1a1d24;
  --text-color: #e0e0e0;
  --button-bg-color: #2a3a5a;
  --button-text-color: #ffffff;
  --header-bg-color: #0a2240;
  --header-text-color: #ffffff;
  --card-bg-color: #252a36;
  --card-border-color: #3a4556;
  --badge-bg-color: #3a4556;
  --badge-text-color: #ffffff;
  --text-shadow-color: rgba(0, 0, 0, 0.5);
  --filter-bg-color: #252a36;
  --filter-border-color: #3a4556;
  --input-group-text-color: #ffffff;
  --badge-en-proceso-text-color: #ffd700;
  --badge-finalizada-bg-color: #2e7d32;
  --badge-finalizada-text-color: #ffffff;
  --badge-cancelada-rechazada-bg-color: #c62828;
  --badge-cancelada-rechazada-text-color: #ffffff;
  --badge-otro-estado-bg-color: #3a4556;
  --badge-otro-estado-text-color: #ffffff;
  --modal-btn-bg-color: #d4a017;
  --sm-text: #a0a0a0; /* Added missing variable */
}
</style>
