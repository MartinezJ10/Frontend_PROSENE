<template>
    <div class="superadmin">
      <!-- Navbar superior -->
      <nav class="navbar navbar-expand-lg navbar-dark navbar-top">
        <div class="container-fluid">
          <!-- Botón hamburguesa para móviles -->
          <button class="btn btn-white me-2 d-lg-none" @click="toggleSidebar">
            <i class="bi bi-list"></i>
          </button>
          <div class="d-flex align-items-center">
            <img src="@/assets/logo_unah.png" alt="Logo UNAH" width="80" height="50" class="d-inline-block align-top">
          </div>
          <div class="d-flex flex-grow-1 justify-content-center">
            <span class="h4 mb-0 title-page">Sistema de Gestión Universitaria</span>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-white me-2 border notification-button" @click="toggleNotificationPanel">
              <i class="bi bi-bell"></i> Notificaciones
            </button>
            <NotificationPanel :isAdmin="true" :url="notificationAdminUrl" v-if="isNotificationPanelVisible"
              @close="toggleNotificationPanel" />
            <button class="btn btn-danger" @click="handleExit">
              <i class="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
  
      <!-- Overlay para cerrar menú lateral en móviles -->
      <div v-if="isSidebarOpen" class="overlay d-lg-none" @click="toggleSidebar"></div>
  
      <!-- Contenedor principal: menú lateral y área de contenido -->
      <div class="content-wrapper">
        <!-- Menú lateral -->
        <div :class="['navbar-left', { 'sidebar-open': isSidebarOpen }]" class="p-3">
          <!-- Botón para cerrar menú lateral en móviles -->
          <button class="btn btn-link close-sidebar d-lg-none" @click="toggleSidebar">
            <i class="bi bi-x-lg"></i>
          </button>
          <h4 class="text-dark menu-header">Menú</h4>
          <ul class="nav flex-column">
            <li class="nav-item">
              <button class="nav-link" @click="router.push('/CreateUser')">
                <i class="bi bi-person-plus"></i><span class="menu-text">Creacion de usuarios</span>
              </button>
            </li>
            <li class="nav-item" v-if="currentUserRole !== 2">
              <button class="nav-link" @click="router.push('/manageUsers')">
                <i class="bi bi-people"></i><span class="menu-text">Empleados</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" @click="router.push('/StudentList')">
                <i class="bi bi-mortarboard"></i><span class="menu-text">Estudiantes</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" @click="router.push('/solicitudes')">
                <i class="bi bi-bar-chart"></i><span class="menu-text">Dashboard de Solicitudes</span>
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Área principal de contenido -->
        <div class="container-fluid p-4 main-content">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <WelcomeMessage :role_id="currentUserRole" />

  </template>
  
  <script>
  import NotificationPanel from '@/components/NotificationPanel.vue';
  import { ref, onMounted } from 'vue';
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
      const isNotificationPanelVisible = ref(false);
      const notificationAdminUrl = "http://localhost:8000/api/v1/notificaciones/admin/";
  
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
    overflow: hidden;
  }
  
  body {
    background-color: #f8f9fa;
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
    overflow: hidden;
  }
  
  /* Menú lateral para escritorio */
  .navbar-left {
    height: 100%;
    width: 60px;
    background: url('Background-Lateral.avif') no-repeat center center;
    background-size: cover;
    transition: width 0.5s ease-in-out;
    overflow: hidden;
  }
  
  /* Expansión del menú lateral en escritorio al hacer hover */
  @media (min-width: 769px) {
    .navbar-left:hover {
      width: 300px;
    }
  }
  
  /* Menú lateral para móviles */
  @media (max-width: 768px) {
    .navbar-left {
      position: fixed;
      top: 0;
      left: -250px;
      width: 250px;
      height: 100%;
      z-index: 1050;
      background: url('Background-Lateral.avif') no-repeat center center;
      background-size: cover;
      transition: left 0.3s ease;
    }
  
    .navbar-left.sidebar-open {
      left: 0;
    }
  
    /* Evitar efecto hover en móviles */
    .navbar-left:hover {
      width: 250px;
    }
  }
  
  /* Botones del menú */
  .nav-link {
    width: 100%;
    min-height: 50px;
    color: #002D62;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: #FFCC00;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    white-space: nowrap;
    border: none;
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
    margin-left: 10px;
    white-space: nowrap;
  }
  
  /* Mostrar el texto del menú en escritorio al hacer hover */
  @media (min-width: 769px) {
    .navbar-left:hover .menu-text {
      opacity: 1;
    }
  }
  
  /* Mostrar siempre el texto del menú en móviles cuando esté abierto */
  @media (max-width: 768px) {
    .sidebar-open .menu-text {
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
  
  @media (max-width: 768px) {
    .sidebar-open .menu-header {
      opacity: 1;
    }
  }
  
  /* Botón para cerrar el menú lateral en móviles */
  .close-sidebar {
    font-size: 1.5rem;
    color: #002D62;
    margin-bottom: 1rem;
  }
  
  /* Área principal de contenido: se adapta al espacio restante sin scroll */
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
  </style>