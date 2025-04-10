<template>
  <!-- Contenedor raíz: ocupa el 100% de la ventana y organiza en columna -->
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="superadmin" role="main">
    <!-- Navbar superior -->
    <!-- role="navigation" identifica la barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark navbar-top" role="navigation">
      <div class="container-fluid">
        <div class="d-flex align-items-center">
          <img src="@/assets/logo_unah.png" alt="Logo UNAH" width="60" height="40" class="d-inline-block align-top">
        </div>
        <div class="d-flex flex-grow-1 justify-content-center">
          <!-- Título para escritorio y tablets -->
          <span class="h5 mb-0 title-page d-none d-md-block">Sistema de Gestión Universitaria</span>
          <!-- Título para móvil -->
          <span class="h5 mb-0 title-page d-md-none">Sistema de Gestión</span>
        </div>
        <div class="d-flex align-items-center">
          <!-- aria-label describe el botón de notificaciones -->
          <button class="btn btn-white me-2 border notification-button" @click="toggleNotificationPanel" aria-label="Abrir panel de notificaciones">
            <i class="bi bi-bell"></i> <span class="notification-text d-none d-sm-inline">Notificaciones</span>
          </button>
          <!-- role="dialog" para el panel de notificaciones -->
          <NotificationPanel :isAdmin="true" :url="notificationAdminUrl" v-if="isNotificationPanelVisible"
            @close="toggleNotificationPanel" role="dialog" aria-label="Panel de notificaciones" />
          <!-- aria-label describe el botón de cerrar sesión -->
          <button class="btn btn-danger logout-btn" @click="handleExit" aria-label="Cerrar sesión">
            <i class="bi bi-box-arrow-right"></i> <span class="logout-text d-none d-sm-inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenedor principal: menú lateral y área de contenido -->
    <div class="content-wrapper">
      <!-- Botón para expandir/contraer el menú en móvil -->
      <button class="mobile-menu-toggle" @click="toggleSidebar" aria-label="Toggle menu">
        <i :class="['bi', isSidebarOpen ? 'bi-x' : 'bi-list']"></i>
      </button>
      
      <!-- Menú lateral -->
      <!-- role="navigation" para el menú lateral -->
      <div :class="['navbar-left', { 'sidebar-open': isSidebarOpen }]" class="p-3" role="navigation">
        <!-- Botón para cerrar el menú en móvil -->
        <button v-if="isSidebarOpen" class="close-sidebar d-md-none" @click="toggleSidebar" aria-label="Cerrar menú">
          <i class="bi bi-x-lg"></i>
        </button>
        <h4 class="text-dark menu-header">Menú</h4>
        <ul class="nav flex-column">
          <li class="nav-item">
            <button class="nav-link" @click="router.push('/CreateUser'); isSidebarOpen = false;" aria-label="Creación de usuarios">
              <i class="bi bi-person-plus" aria-hidden="true"></i><span class="menu-text">Creación de usuarios</span>
            </button>
          </li>
          <li class="nav-item" v-if="currentUserRole !== 2">
            <button class="nav-link" @click="router.push('/manageUsers'); isSidebarOpen = false;" aria-label="Gestionar empleados">
              <i class="bi bi-people" aria-hidden="true"></i><span class="menu-text">Empleados</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="router.push('/StudentList'); isSidebarOpen = false;" aria-label="Lista de estudiantes">
              <i class="bi bi-mortarboard" aria-hidden="true"></i><span class="menu-text">Estudiantes</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="router.push('/solicitudes'); isSidebarOpen = false;" aria-label="Dashboard de solicitudes">
              <i class="bi bi-bar-chart" aria-hidden="true"></i><span class="menu-text">Dashboard de Solicitudes</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Overlay para cerrar el menú en móvil al hacer clic fuera -->
      <div v-if="isSidebarOpen" class="overlay" @click="toggleSidebar"></div>

      <!-- Área principal de contenido -->
      <!-- role="region" para el contenido principal -->
      <div class="container-fluid p-3 main-content" role="region" aria-label="Contenido principal">
        <router-view></router-view>
      </div>
    </div>
  </div>

  <WelcomeMessage :role_id="currentUserRole" />
</template>

<script>
import NotificationPanel from '@/components/NotificationPanel.vue';
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import utils from '../utils';

export default {
  name: 'LandingAdmin',
  components: {
    NotificationPanel
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const requestURL = inject("requestURL")
    const isNotificationPanelVisible = ref(false);
    const notificationAdminUrl = `${requestURL}/api/v1/notificaciones/admin/`;

    const currentUserRole = utils.getCurrentUserRole(); // Variable para almacenar el rol del usuario

    const isLandingAdminPage = route.path === '/landingAdmin';

    const toggleNotificationPanel = () => {
      isNotificationPanelVisible.value = !isNotificationPanelVisible.value;
    };

    const handleExit = () => {
      localStorage.removeItem("jwt"); // Eliminamos el JWT al cerrar sesión
      router.push("/login");
    };

    const isSidebarOpen = ref(false);
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    // Cerrar el sidebar cuando cambia la ruta
    router.afterEach(() => {
      isSidebarOpen.value = false;
    });

    // Cerrar el sidebar cuando cambia el tamaño de la ventana a desktop
    onMounted(() => {
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
          isSidebarOpen.value = false;
        }
      });
    });

    return {
      notificationAdminUrl,
      router,
      isLandingAdminPage,
      handleExit,
      isSidebarOpen,
      toggleSidebar,
      isNotificationPanelVisible,
      toggleNotificationPanel,
      currentUserRole
    };
  }
};
</script>

<style scoped>
/* Contenedor raíz: ocupa el 100% de la ventana y organiza en columna */
.superadmin {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Aseguramos que html y body ocupen el 100% sin scroll */
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: scroll;
}

body {
  background-color: #E5E5E5; /* Gris claro */
  color: #333333; /* Negro suave para el texto */
}

/* Navbar superior con altura fija */
.navbar-top {
  background-color: #002D62;
  flex: 0 0 auto;
}

/* Contenedor principal: ocupa el resto de la ventana sin scroll */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

/* Menú lateral para escritorio */
.navbar-left {
  height: 100%;
  width: 50px;
  background-size: cover;
  transition: width 0.5s ease-in-out;
  overflow: hidden;
  z-index: 1050;
  background-color: white;
}

/* Expansión del menú lateral en escritorio al hacer hover */
@media (min-width: 769px) {
  .navbar-left:hover {
    width: 250px;
  }
}

/* Botones del menú */
.nav-link {
  width: 100%;
  min-height: 40px;
  color: #002D62;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #FFC72C;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border: none;
  font-size: 0.9rem;
}

.nav-link:hover {
  background-color: #FFD700;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu-text {
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-left: 8px;
  white-space: nowrap;
  font-size: 0.85rem;
}

/* Mostrar el texto del menú en escritorio al hacer hover */
@media (min-width: 769px) {
  .navbar-left:hover .menu-text {
    opacity: 1;
  }
}

.menu-header {
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-bottom: 20px;
  white-space: nowrap;
}

@media (min-width: 769px) {
  .navbar-left:hover .menu-header {
    opacity: 1;
  }
}

/* Área principal de contenido: se adapta al espacio restante con scroll vertical cuando es necesario */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px !important;
  padding-bottom: 20px !important;
  padding-right: 20px !important;
  padding-top: 0px !important;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.title-page {
  color: white;
}

/* Estilos del mensaje de bienvenida */
.welcome-message {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.welcome-message h2 {
  color: #002D62;
}

.welcome-message p {
  color: #6c757d;
}

/* Botón de notificaciones */
.btn-white {
  background-color: white;
  color: #002D62;
  border: 1px solid #002D62;
}

.btn-white:hover {
  background-color: #f0f0f0;
  color: #000;
  border-color: #002D62;
}

/* Overlay para el menú lateral en móviles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Botón para mostrar/ocultar menú en móvil */
.mobile-menu-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #002D62;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1060;
  font-size: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Botón para cerrar el menú lateral */
.close-sidebar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #002D62;
  cursor: pointer;
}

/* Estilos para pantallas extra pequeñas (menos de 576px - mayoría de smartphones) */
@media (max-width: 575.98px) {
  /* Mostrar botón de menú móvil */
  .mobile-menu-toggle {
    display: flex;
  }
  
  /* Ajustar el navbar top */
  .navbar-top .container-fluid {
    padding-left: 5px;
    padding-right: 5px;
  }
  
  /* Reducir el tamaño del logo */
  .navbar-top img {
    width: 40px;
    height: 35px;
  }
  
  /* Reducir el tamaño del título */
  .title-page {
    font-size: 0.9rem;
  }
  
  /* Hacer los botones más pequeños */
  .notification-button, .logout-btn {
    padding: 4px 6px;
    font-size: 12px;
  }
  
  /* Ajustar el menú lateral en móvil */
  .navbar-left {
    position: fixed;
    top: 0;
    left: -250px;
    width: 250px;
    height: 100%;
    background-color: white;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    padding-top: 60px;
    z-index: 1050;
    transition: left 0.3s ease-in-out;
  }
  
  /* Menú expandido */
  .navbar-left.sidebar-open {
    left: 0;
  }
  
  /* Mostrar siempre el texto del menú en móvil */
  .menu-text, .menu-header {
    opacity: 1;
  }
  
  /* Ajustar el padding del contenido principal */
  .main-content {
    padding: 8px !important;
  }
}

/* Estilos para pantallas pequeñas (576px a 767px - smartphones grandes y algunas tablets) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Mostrar botón de menú móvil */
  .mobile-menu-toggle {
    display: flex;
  }
  
  /* Ajustar el navbar top */
  .navbar-top .container-fluid {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  /* Ajustar el menú lateral en móvil */
  .navbar-left {
    position: fixed;
    top: 0;
    left: -250px;
    width: 250px;
    height: 100%;
    background-color: white;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    padding-top: 60px;
    z-index: 1050;
    transition: left 0.3s ease-in-out;
  }
  
  /* Menú expandido */
  .navbar-left.sidebar-open {
    left: 0;
  }
  
  /* Mostrar siempre el texto del menú en móvil */
  .menu-text, .menu-header {
    opacity: 1;
  }
  
  /* Ajustar el padding del contenido principal */
  .main-content {
    padding: 10px !important;
  }
}

/* Estilos para tablets y móviles en horizontal (768px a 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Ajustar tamaño del título */
  .title-page {
    font-size: 1.1rem;
  }
  
  /* Ajustar padding del contenido principal */
  .main-content {
    padding: 15px !important;
  }
}

/* Fix para notificaciones y menú en dispositivos iOS */
@supports (-webkit-touch-callout: none) {
  /* Fixes específicos para iOS */
  .navbar-left {
    -webkit-overflow-scrolling: touch; /* Mejorar scroll en iOS */
  }
  
  /* Evitar problema de 100vh en iOS */
  .superadmin {
    height: 100%;
    min-height: 100vh;
  }
  
  /* Arreglar posible problema con el overflow en Safari */
  .main-content {
    -webkit-overflow-scrolling: touch;
  }
}

/* Optimización para tablets Android (ajustes específicos de algunos dispositivos) */
@media screen and (min-width: 600px) and (max-width: 900px) and (-webkit-min-device-pixel-ratio: 1.5) {
  /* Ajustes para tablets Android con alta densidad de píxeles */
  .navbar-top img {
    width: 55px;
    height: 55px;
  }
  
  .title-page {
    font-size: 1.05rem;
  }
}

/* Ajuste para asegurar que la barra de navegación sea usable en pantallas muy pequeñas */
@media (max-width: 359.98px) {
  /* Para pantallas muy pequeñas como iPhone SE */
  .navbar-top .container-fluid {
    padding-left: 2px;
    padding-right: 2px;
  }
  
  .navbar-top img {
    width: 35px;
    height: 22px;
  }
  
  .title-page {
    font-size: 0.8rem;
  }
  
  .notification-button, .logout-btn {
    padding: 3px 5px;
    margin-left: 2px;
    margin-right: 2px;
  }
}
</style>