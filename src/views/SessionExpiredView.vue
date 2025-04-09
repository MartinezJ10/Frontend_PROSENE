<template>
    <div class="session-expired-container">
      <div class="session-expired-card">
        <div class="session-expired-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 class="session-expired-title">Sesión expirada</h1>
        <p class="session-expired-message">
          Tu sesión ha expirado por motivos de seguridad.
          Por favor, inicia sesión nuevamente para continuar.
        </p>
        <button class="session-expired-button" @click="redirectToLogin">
          Iniciar sesión
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SessionExpiredView',
    methods: {
      redirectToLogin() {
        // Limpiar cualquier información de sesión que pueda quedar
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Redirigir al usuario a la página de inicio de sesión
        // Puedes cambiar '/login' por la ruta de tu página de login
        this.$router.push('/login');
      }
    },
    // Opcionalmente, puedes usar mounted para manejar cualquier limpieza adicional
    mounted() {
      // Notificar a vuex/pinia que la sesión expiró (si estás usando algún store)
      if (this.$store) {
        this.$store.dispatch('auth/clearUserData');
      }
    }
  }
  </script>
  
  <style scoped>
  .session-expired-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 1rem;
  }
  
  .session-expired-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    max-width: 450px;
    width: 100%;
    text-align: center;
  }
  
  .session-expired-icon {
    color: #e74c3c;
    margin-bottom: 1.5rem;
  }
  
  .session-expired-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .session-expired-message {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .session-expired-button {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .session-expired-button:hover {
    background-color: #2980b9;
  }
  </style>