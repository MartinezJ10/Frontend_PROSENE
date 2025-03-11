<template>
    <div class="welcome-message">
      <h2>Bienvenido al Panel de Super Administrador</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WelcomeMessage'
  }
  </script>
  
  <style scoped>
  .welcome-message {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
  }
  .welcome-message h2 {
    color: #002D62;
  }
  .welcome-message p {
    color: #6c757d;
  }
  </style>
  