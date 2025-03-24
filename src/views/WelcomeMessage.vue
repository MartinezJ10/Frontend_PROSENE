<template>
  <div class="welcome-message">
    <h2>Bienvenido al Panel de Manejo de Solicitudes</h2>
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
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%; 
  background-color: transparent;
}

.welcome-message h2 {
  color: #002D62;
  margin: 0; /* Elimina márgenes por defecto de h2 */
}

.welcome-message p {
  color: #6c757d;
  margin: 10px 0 0 0; /* Ajusta márgenes del párrafo */
}
</style>