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
          <!-- Se carga la vista según la ruta (por ejemplo, WelcomeMessage.vue para '/landingAdmin') -->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'LandingAdmin',
    setup() {
      const router = useRouter();
  
      // Funcionalidad para cerrar sesión
      const handleExit = () => {
        localStorage.setItem("jwt", "");
        router.push("/login");
      };
  
      // Controla la visibilidad del menú lateral en móviles
      const isSidebarOpen = ref(false);
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      return { router, handleExit, isSidebarOpen, toggleSidebar };
    }
  };
  </script>
  
  <style scoped>
  /* Aquí se mantienen los estilos originales de LandingAdmin.vue */
  
  /* Contenedor raíz: ocupa el 100% de la ventana y organiza en columna */
  .superadmin {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  /* Aseguramos que html y body ocupen el 100% sin scroll */
  html, body {
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
    padding: 20px 20px 20px 20px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f9f9f9;
    overflow-y: auto;
  }
  
  .title-page {
    color: white;
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
    background: rgba(0,0,0,0.5);
    z-index: 1040;
  }
  </style>
  