<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { provide, ref, onMounted } from 'vue';

export default {
    name: 'App',
    setup() {
        const isHighContrast = ref(false);

        const toggleTheme = () => {
            isHighContrast.value = !isHighContrast.value;
            localStorage.setItem('highContrast', isHighContrast.value);
            document.documentElement.classList.toggle('high-contrast', isHighContrast.value);
        };

        provide('isHighContrast', isHighContrast);
        provide('toggleTheme', toggleTheme);

        onMounted(() => {
            const savedTheme = localStorage.getItem('highContrast');
            if (savedTheme !== null) {
                isHighContrast.value = savedTheme === 'true';
                document.documentElement.classList.toggle('high-contrast', isHighContrast.value);
            }
        });

        return {};
    },
};
</script>

<style>
:root {
    --primary-color: #003366;
    --brat: #fff;
    /* Dark blue */
    --secondary-color: #ffd100;
    /* Yellow */
    --background-color: #f4f7fc;
    /* Light gray */
    --text-color: #000;
    /* Black */
    --button-bg-color: #ffd100;
    /* Yellow */
    --button-text-color: #003366;
    /* Dark blue */
    --header-bg-color: #003366;
    /* Dark blue */
    --header-text-color: #fff;
    /* White */
    --card-bg-color: #fff;
    /* White */
    --card-border-color: #ddd;
    /* Light gray */
    --badge-bg-color: #e2e3e5;
    /* Light gray */
    --badge-text-color: #383d41;
    /* Dark gray */
    --text-shadow-color: rgba(0, 0, 0, 0.3);
    /* Black shadow */
    --filter-bg-color: #f8f9fa;
    /* Light gray */
    --filter-border-color: #ddd;
    /* Light gray */
    --input-group-text-color: #fff;
    /* White */
    --badge-en-proceso-text-color: #856404;
    /* Dark yellow */
    --badge-finalizada-bg-color: #d4edda;
    /* Light green */
    --badge-finalizada-text-color: #155724;
    /* Dark green */
    --badge-cancelada-rechazada-bg-color: #f8d7da;
    /* Light red */
    --badge-cancelada-rechazada-text-color: #721c24;
    /* Dark red */
    --badge-otro-estado-bg-color: #dee2e6;
    /* Light gray */
    --badge-otro-estado-text-color: #495057;
    /* Dark gray */
    --modal-btn-bg-color: #ffd100;
}

.high-contrast {
    --primary-color: #000000;
    /* Black */
    --secondary-color: #ffffff;
    /* White */
    --background-color: #ffffff;
    /* Black */
    --brat: #84cf00;
    /*BRAT */
    --text-color: #ffffff;
    /* White */
    --button-bg-color: #ffffff;
    /* White */
    --button-text-color: #000000;
    /* Black */
    --header-bg-color: #000000;
    /* Black */
    --header-text-color: #ffffff;
    /* White */
    --card-bg-color: #000000;
    /* Very dark gray */
    --card-border-color: #ffffff;
    /* White */
    --badge-bg-color: #ffffff;
    /* White */
    --badge-text-color: #000000;
    /* Black */
    --text-shadow-color: rgba(255, 255, 255, 0.7);
    /* White shadow with higher opacity */
    --filter-bg-color: #000000;
    /* Black */
    --filter-border-color: #ffffff;
    /* White */
    --input-group-text-color: #000000;
    /* Black */
    --badge-en-proceso-text-color: #ffffff;
    /* White */
    --badge-finalizada-bg-color: #333333;
    /* Dark gray */
    --badge-finalizada-text-color: #ffffff;
    /* White */
    --badge-cancelada-rechazada-bg-color: #4d4d4d;
    /* Dark gray */
    --badge-cancelada-rechazada-text-color: #ffffff;
    /* White */
    --badge-otro-estado-bg-color: #666666;
    /* Medium gray */
    --badge-otro-estado-text-color: #ffffff;
    /* White */
    --modal-btn-bg-color: #84cf00;

}
</style>