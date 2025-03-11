<template>
    <div class="superadmin">
      <!-- Navbar superior -->
      <nav class="navbar navbar-expand-lg navbar-dark navbar-top">
        <div class="container-fluid">
          <!-- Botón hamburguesa para móviles -->
          <button class="btn btn-white me-2 d-lg-none" @click="toggleSidebar">
            <i class="bi bi-list"></i>
          </button>
  
          <!-- Logo UNAH -->
          <div class="d-flex align-items-center">
            <img
              src="@/assets/logo_unah.png"
              alt="Logo UNAH"
              width="80"
              height="50"
              class="d-inline-block align-top"
            />
          </div>
  
          <!-- Título centrado -->
          <div class="d-flex flex-grow-1 justify-content-center">
            <span class="h4 mb-0 title-page">Sistema de Gestión Universitaria</span>
          </div>
  
          <!-- Botones a la derecha (Notificaciones y Cerrar sesión) -->
          <div class="d-flex align-items-center">
            <button class="btn btn-white me-2">
              <i class="bi bi-bell"></i> Notificaciones
            </button>
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
              <button class="nav-link" @click="router.push('/manageUsers')">
                <i class="bi bi-people"></i><span class="menu-text">Usuarios/Empleados</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" @click="router.push('/studentEnrollment')">
                <i class="bi bi-person"></i><span class="menu-text">Estudiantes</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" @click="router.push('/solicitudes')">
                <i class="bi bi-bar-chart"></i><span class="menu-text">Solicitudes</span>
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Área principal de contenido -->
        <div class="container-fluid p-4 main-content">
          <!-- Mensaje de bienvenida solo si estamos en /landingAdmin -->
          <div v-if="isLandingAdminPage" class="welcome-message">
            <h2>Bienvenido al Panel de Super Administrador</h2>
            <p>Selecciona una opción del menú para comenzar.</p>
          </div>
  
          <!-- Vistas dinámicas (por ejemplo, Lista de Usuarios) -->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  export default {
    name: 'LandingAdmin',
    setup() {
      const router = useRouter()
      const route = useRoute()
  
      // Mostrar el mensaje de bienvenida solo en '/landingAdmin'
      const isLandingAdminPage = route.path === '/landingAdmin'
  
      // Funcionalidad para cerrar sesión
      const handleExit = () => {
        localStorage.setItem('jwt', '')
        router.push('/login')
      }
  
      // Controla la visibilidad del menú lateral en móviles
      const isSidebarOpen = ref(false)
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value
      }
  
      return {
        router,
        isLandingAdminPage,
        handleExit,
        isSidebarOpen,
        toggleSidebar
      }
    }
  }
  </script>
  
  <style scoped>
  /* --- Ajustes generales --- */
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
  }
  
  .superadmin {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f9fa;
  }
  
  /* --- Navbar superior --- */
  .navbar-top {
    background-color: #002d62;
    flex: 0 0 auto;
  }
  
  .title-page {
    color: white;
  }
  
  /* --- Contenedor principal (sidebar + contenido) --- */
  .content-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  /* --- Menú lateral --- */
  .navbar-left {
    height: 100%;
    width: 60px; /* Anchura inicial en escritorio */
    background: url('Background-Lateral.avif') no-repeat center center;
    background-size: cover;
    transition: width 0.5s ease-in-out;
    overflow: hidden;
    padding-top: 1rem;
  }
  
  @media (min-width: 769px) {
    .navbar-left:hover {
      width: 300px; /* Se expande al hacer hover en escritorio */
    }
  }
  
  /* --- Sidebar en móviles --- */
  @media (max-width: 768px) {
    .navbar-left {
      position: fixed;
      top: 0;
      left: -250px;
      width: 250px;
      height: 100%;
      z-index: 1050;
      transition: left 0.3s ease;
    }
    .navbar-left.sidebar-open {
      left: 0;
    }
    .navbar-left:hover {
      width: 250px;
    }
  }
  
  /* --- Botones de menú --- */
  .nav-link {
    width: 100%;
    min-height: 50px;
    color: #002d62;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: #ffcc00;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    white-space: nowrap;
    border: none;
  }
  
  .nav-link:hover {
    background-color: #ffd700;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .menu-text {
    opacity: 0;
    margin-left: 10px;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
  
  /* Texto visible en escritorio al hacer hover */
  @media (min-width: 769px) {
    .navbar-left:hover .menu-text {
      opacity: 1;
    }
  }
  
  /* Texto siempre visible en móviles cuando el menú está abierto */
  @media (max-width: 768px) {
    .sidebar-open .menu-text {
      opacity: 1;
    }
  }
  
  .menu-header {
    opacity: 0;
    margin-bottom: 20px;
    transition: opacity 0.3s ease;
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
  
  /* --- Botón para cerrar el menú lateral en móviles --- */
  .close-sidebar {
    font-size: 1.5rem;
    color: #002d62;
    margin-bottom: 1rem;
  }
  
  /* --- Área principal de contenido --- */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow: auto; /* para scroll vertical */
    box-sizing: border-box;
    background-color: #f9f9f9;
  }
  
  /* --- Mensaje de bienvenida --- */
  .welcome-message {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    text-align: center;
  }
  
  .welcome-message h2 {
    color: #002d62;
  }
  .welcome-message p {
    color: #6c757d;
  }
  
  /* --- Botón de notificaciones (blanco) --- */
  .btn-white {
    background-color: white;
    color: #002d62;
    border: 1px solid #002d62;
  }
  
  .btn-white:hover {
    background-color: #f0f0f0;
    color: #000;
    border-color: #002d62;
  }
  
  /* --- Overlay para cerrar menú lateral en móviles --- */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1040;
  }
  </style>
  