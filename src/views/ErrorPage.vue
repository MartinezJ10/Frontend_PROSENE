<template>
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 class="error-title">{{ title }}</h1>
        <p class="error-message">{{ message }}</p>
        <div class="error-actions">
          <button @click="goHome" class="home-button">
            Ir al inicio
          </button>
          <button @click="goBack" class="back-button">
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorPage',
    props: {
      statusCode: {
        type: Number,
        default: 404
      },
      isUnauthorized: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      title() {
        return this.isUnauthorized ? 'Acceso denegado' : 'Página no encontrada';
      },
      message() {
        if (this.isUnauthorized) {
          return 'No tienes permisos para acceder a esta página. Por favor, inicia sesión o contacta con el administrador.';
        }
        return 'La página que estás buscando no existe o ha sido movida a otra ubicación.';
      }
    },
    methods: {
      goHome() {
        localStorage.removeItem('jwt');
        this.$router.push('/');
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  }
  </script>
  
  <style scoped>
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 1rem;
  }
  
  .error-content {
    max-width: 500px;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .error-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #e74c3c;
  }
  
  .error-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  .error-message {
    font-size: 1.1rem;
    line-height: 1.5;
    color: #5d6778;
    margin-bottom: 2rem;
  }
  
  .error-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .home-button, .back-button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
  }
  
  .home-button {
    background-color: #3498db;
    color: white;
  }
  
  .home-button:hover {
    background-color: #2980b9;
  }
  
  .back-button {
    background-color: #ecf0f1;
    color: #34495e;
  }
  
  .back-button:hover {
    background-color: #dfe6e9;
  }
  </style>